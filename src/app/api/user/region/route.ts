import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/app/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { region } = await request.json();

    if (!region || typeof region !== 'string') {
      return NextResponse.json(
        { error: 'Invalid region' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: { region },
      select: {
        id: true,
        region: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user region:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}