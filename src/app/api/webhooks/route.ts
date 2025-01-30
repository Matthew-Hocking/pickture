import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const wh = new Webhook(SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: Missing Svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new NextResponse('Error: Verification error', {
      status: 400
    })
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { id, email_addresses, first_name, image_url } = evt.data;

    try {
      const user = await prisma.user.upsert({
        where: {
          id: id
        },
        create: {
          id: id,
          email: email_addresses[0]?.email_address ?? '',
          name: first_name,
          imageUrl: image_url ?? null,
        },
        update: {
          email: email_addresses[0]?.email_address ?? '',
          name: first_name,
          imageUrl: image_url ?? null,
        }
      });

      return NextResponse.json({
        message: `User ${evt.type === 'user.created' ? 'created' : 'updated'} successfully`,
        user
      }, { status: 201 });
      
    } catch (error) {
      console.error('Error upserting user:', error);
      return NextResponse.json({
        error: 'Error upserting user in database'
      }, { status: 500 });
    }
  }

  return new NextResponse('', { status: 200 })
}