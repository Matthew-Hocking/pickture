import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { DEFAULT_REGION } from "./app/lib/constants";
import { getUserRegion } from "./app/lib/auth";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/api/webhooks"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    if (req.url.includes("api/webhooks")) {
      return NextResponse.next();
    }

    const { userId } = await auth();

    if (isPublicRoute(req)) {
      if (userId) {
        return NextResponse.redirect(new URL("/", req.url));
      } else {
        return NextResponse.next();
      }
    }

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    let region = DEFAULT_REGION;

    try {
      if (userId) {
        region = await getUserRegion(userId);
      }
    } catch (error) {
      console.log("Error getting user region:", error);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-region", region);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.log("Error in middleware:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
