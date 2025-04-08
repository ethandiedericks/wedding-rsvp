import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function middleware(request: NextRequest) {
  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/", "/public", "/gifts"]

  // Check if the current path is public
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // If no session, redirect to sign-in page with the original URL as a parameter
  if (!session) {
    const redirectUrl = new URL("/auth/signin", request.url)
    // Add the original path as a query parameter to redirect back after login
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)

    const response = NextResponse.redirect(redirectUrl)
    // Add a cache control header to prevent caching of this redirect
    response.headers.set("x-middleware-cache", "no-cache")
    return response
  }

  // Check user role for admin access
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  const role = profile?.role || "guest"

  // Redirect non-admin users trying to access admin pages
  if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/rsvp", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/rsvp/:path*", "/admin/:path*"],
}

