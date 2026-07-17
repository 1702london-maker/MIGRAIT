import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/about', '/pricing', '/contact', '/login', '/register', '/reset-password', '/privacy', '/terms', '/cookies']

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Admin route protection — check httpOnly cookie before Supabase
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/api/admin/auth')) {
    const adminCookie = req.cookies.get('migrait_admin')?.value
    if (adminCookie !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  let response = NextResponse.next({ request: { headers: req.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: req.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: req.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const isPublic =
    PUBLIC_PATHS.some(p => pathname === p) ||
    pathname.startsWith('/live/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')

  if (!isPublic && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/app/dashboard', req.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
