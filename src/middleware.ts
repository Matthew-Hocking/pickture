import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth()
    const { nextUrl } = req
  
    if (nextUrl.pathname === '/' && userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  
    if (isProtectedRoute(req)) {
      if (!userId) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  
    return NextResponse.next();
  } catch (error) {
    console.log('Error in middleware:', error)

    return new NextResponse('Internal Server Error', { status: 500})
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};