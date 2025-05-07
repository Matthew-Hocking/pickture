import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { region } = await request.json();

    if (!region || typeof region !== "string") {
      return NextResponse.json({ error: "Invalid region" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json({ 
        error: "User not found. Make sure the user exists in the database.",
        clerkId: userId
      }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { region },
      select: {
        id: true,
        region: true,
        updatedAt: true,
      },
    });

    const response = NextResponse.json(updatedUser);
    response.cookies.set("pickture-region", region, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error updating user region:", error);
    
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json({ 
        error: `Prisma error: ${error.message}`, 
        code: error.code 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}