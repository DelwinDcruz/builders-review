import { NextResponse, type NextRequest } from "next/server";
/** Never index admin, account or auth pages, even if linked. */
const NOINDEX = ["/admin", "/account", "/auth"];
export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  if (NOINDEX.some((p) => request.nextUrl.pathname.startsWith(p))) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
