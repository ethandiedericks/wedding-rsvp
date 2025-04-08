
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          requestHeaders.set('Set-Cookie', `${name}=${value}; Path=/`)
        },
        remove(name: string, options: any) {
          requestHeaders.set('Set-Cookie', `${name}=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Define public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/", "/public", "/gifts"]

  // Check if the current path is public
  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // If no session and trying to access protected route, redirect to sign-in
  if (!session) {
    if (!publicPaths.includes(request.nextUrl.pathname)) {
      const redirectUrl = new URL("/auth/signin", request.url)
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // For authenticated users, check role for admin access
  if (session) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    const role = profile?.role || "guest"

    // Redirect non-admin users trying to access admin pages
    if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Add role to request header for use in pages
    requestHeaders.set("x-user-role", role)
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/rsvp/:path*", "/admin/:path*"],
}
