import { execFileSync } from "node:child_process";

export function isThemePreviewEnabled() {
  if (process.env.BRANCH !== undefined) {
    return process.env.BRANCH === "theme-v2";
  }

  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  const branch = execFileSync("git", ["branch", "--show-current"], {
    encoding: "utf8",
  }).trim();

  return branch === "theme-v2";
}
