import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const internationalization = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/theme-preview") {
    const url = request.nextUrl.clone();
    url.pathname = "/fr/theme-preview";
    return NextResponse.rewrite(url);
  }

  return internationalization(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
