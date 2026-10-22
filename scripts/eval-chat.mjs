import { readFile } from "node:fs/promises";

const baseUrl = (process.env.CHAT_EVAL_BASE_URL || "http://localhost:3000")
  .replace(/\/+$/, "");
const evaluationPath = new URL("../tests/chatbot.eval.json", import.meta.url);
const evaluation = JSON.parse(await readFile(evaluationPath, "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalize(value) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function makeEvaluationIp(index) {
  return `198.51.100.${index + 1}`;
}

async function postChat(body, ip, origin = baseUrl) {
  return fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "X-Vercel-Forwarded-For": ip,
    },
    body,
  });
}

async function runCase(testCase, index) {
  const response = await postChat(
    JSON.stringify({
      locale: testCase.locale,
      message: testCase.message,
      history: testCase.history || [],
    }),
    makeEvaluationIp(index),
  );
  const body = await response.text();
  const failures = [];

  if (response.status !== 200) {
    failures.push(`expected HTTP 200, received ${response.status}`);
  }

  const normalizedBody = normalize(body);
  for (const fragment of testCase.expect.includes || []) {
    if (!normalizedBody.includes(normalize(fragment))) {
      failures.push(`missing expected content "${fragment}"`);
    }
  }
  for (const fragment of testCase.expect.forbidden || []) {
    if (normalizedBody.includes(normalize(fragment))) {
      failures.push(`contains forbidden content "${fragment}"`);
    }
  }
  for (const marker of testCase.expect.markers || []) {
    if (!body.includes(marker)) failures.push(`missing marker ${marker}`);
  }

  if (testCase.expect.suggestions) {
    const suggestionLine = body.match(/(?:^|\n)SUGGESTIONS:\s*(.+)$/im)?.[1];
    const suggestions = suggestionLine
      ? suggestionLine.split("|").map((item) => item.trim()).filter(Boolean)
      : [];
    if (suggestions.length < testCase.expect.suggestions.minimum) {
      failures.push(
        `expected at least ${testCase.expect.suggestions.minimum} suggestions`,
      );
    }
  }

  return { id: testCase.id, failures };
}

async function expectStatus(label, status, request) {
  const response = await request;
  await response.text();
  if (response.status !== status) {
    return `${label}: expected HTTP ${status}, received ${response.status}`;
  }
  return null;
}

async function runGuardChecks() {
  const errors = [];
  const validBody = JSON.stringify({
    locale: "en",
    message: "Hello",
    history: [],
  });
  const guardIp = makeEvaluationIp(230);

  for (const result of [
    await expectStatus(
      "Cross-origin request",
      403,
      postChat(validBody, guardIp, "https://example.org"),
    ),
    await expectStatus(
      "Invalid JSON",
      400,
      postChat("{invalid", makeEvaluationIp(231)),
    ),
    await expectStatus(
      "Message longer than 500 characters",
      400,
      postChat(
        JSON.stringify({
          locale: "en",
          message: "x".repeat(501),
          history: [],
        }),
        makeEvaluationIp(232),
      ),
    ),
    await expectStatus(
      "Request body larger than 16 KB",
      413,
      postChat(" ".repeat(17_000), makeEvaluationIp(233)),
    ),
    await expectStatus(
      "Missing origin",
      403,
      fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: validBody,
      }),
    ),
  ]) {
    if (result) errors.push(result);
  }

  let allowed = 0;
  let limited = 0;
  const rateLimitIp = makeEvaluationIp(234);
  for (let index = 0; index < 16; index += 1) {
    const response = await postChat(
      JSON.stringify({
        locale: "en",
        message: `unknown private test question ${index}`,
        history: [],
      }),
      rateLimitIp,
    );
    await response.text();
    if (response.status === 429) limited += 1;
    else if (response.status === 200) allowed += 1;
    else errors.push(`Rate-limit request returned HTTP ${response.status}`);
  }

  if (allowed !== 15 || limited !== 1) {
    errors.push(
      `Rate limit expected 15 allowed and 1 blocked; received ${allowed} allowed and ${limited} blocked`,
    );
  }

  return errors;
}

assert(Array.isArray(evaluation), "Evaluation file must contain an array.");
assert(evaluation.length >= 30, "At least 30 chatbot cases are required.");
const ids = new Set();
for (const testCase of evaluation) {
  assert(
    typeof testCase.id === "string" && !ids.has(testCase.id),
    `Invalid or duplicate test id "${testCase.id}".`,
  );
  ids.add(testCase.id);
  assert(
    (testCase.locale === "fr" || testCase.locale === "en") &&
      typeof testCase.message === "string" &&
      typeof testCase.expect === "object",
    `Invalid evaluation case "${testCase.id}".`,
  );
}

try {
  const healthCheck = await fetch(baseUrl);
  if (!healthCheck.ok) {
    throw new Error(`Base URL returned HTTP ${healthCheck.status}.`);
  }
  await healthCheck.body?.cancel();
} catch (error) {
  console.error(
    `Chat evaluation server is unavailable at ${baseUrl}. Start the app first.`,
  );
  console.error(error instanceof Error ? error.message : "Unknown connection error.");
  process.exitCode = 1;
}

if (process.exitCode !== 1) {
  const results = [];
  for (const [index, testCase] of evaluation.entries()) {
    try {
      results.push(await runCase(testCase, index));
    } catch (error) {
      results.push({
        id: testCase.id,
        failures: [
          error instanceof Error ? error.message : "Unknown evaluation error",
        ],
      });
    }
  }

  const guardErrors = await runGuardChecks();
  const failedCases = results.filter((result) => result.failures.length > 0);
  const failedAssertions =
    failedCases.reduce((count, result) => count + result.failures.length, 0) +
    guardErrors.length;

  console.info(
    `Chat evaluation: ${evaluation.length - failedCases.length}/${evaluation.length} cases passed; 6 HTTP guard checks ${
      guardErrors.length === 0 ? "passed" : "failed"
    }.`,
  );

  for (const result of failedCases) {
    console.error(`FAIL ${result.id}: ${result.failures.join("; ")}`);
  }
  for (const error of guardErrors) {
    console.error(`FAIL ${error}`);
  }

  if (failedAssertions > 0) process.exitCode = 1;
}
