import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This refreshes the auth session token if it's about to expire
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Normalize the pathname so trailing slashes / case quirks don't trip us up
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/";

  // ----------------------------------------------------------------------
  // Define what we're dealing with up front, in clear named variables.
  // ----------------------------------------------------------------------
  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // ----------------------------------------------------------------------
  // CASE 1: Unauthed user trying to access a protected admin page.
  // Send them to login. The login page is NEVER protected (else: loop).
  // ----------------------------------------------------------------------
  if (isAdminArea && !isLoginPage && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ----------------------------------------------------------------------
  // CASE 2: Authed user is on the login page — bounce them to the dashboard.
  // ----------------------------------------------------------------------
  if (isLoginPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.search = ""; // strip any ?next= params
    return NextResponse.redirect(redirectUrl);
  }

  // ----------------------------------------------------------------------
  // Otherwise just continue. This includes:
  //   - unauthed users on /admin/login (correct: they need to log in)
  //   - authed users on protected admin pages (correct: let them through)
  //   - any non-admin page
  // ----------------------------------------------------------------------
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};