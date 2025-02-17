import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCountryFromIP } from "@/app/utils";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET
  if (!SIGNING_SECRET) {
    console.error('Missing WEBHOOK_SIGNING_SECRET environment variable');
    return NextResponse.json({ 
      error: 'Server configuration error' 
    }, { status: 500 });
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();

  const forwardedFor = headerPayload.get('x-forwarded-for');
  console.log(forwardedFor);
  const ip = forwardedFor ? forwardedFor.split(",")[0] : null;
  
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing required Svix headers');
    return NextResponse.json({ 
      error: 'Missing required headers' 
    }, { status: 400 });
  }

  let evt: WebhookEvent;
  
  try {
    const payload = await req.json();
    const body = JSON.stringify(payload);

    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return NextResponse.json({ 
      error: 'Webhook verification failed' 
    }, { status: 400 });
  }

  console.log('Received webhook event:', evt.type);

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (!id) {
      console.error('Missing user ID in webhook payload');
      return NextResponse.json({ 
        error: 'Missing user ID' 
      }, { status: 400 });
    }

    if (!email_addresses?.length) {
      console.error('No email addresses found for user:', id);
      return NextResponse.json({
        error: 'Missing required email address'
      }, { status: 400 });
    }

    const region = ip ? await getCountryFromIP(ip) : "US";

    try {
      const user = await prisma.user.upsert({
        where: { id },
        create: {
          clerkId: id,
          region
        },
        update: {
          region
        }
      });

      console.log(`User ${evt.type === 'user.created' ? 'created' : 'updated'}:`, user.id);

      return NextResponse.json({
        message: `User ${evt.type === 'user.created' ? 'created' : 'updated'} successfully`,
        user
      }, { status: 201 });
      
    } catch (error) {
      console.error('Error upserting user:', error);
      console.error('Attempted payload:', {
        id,
        email: email_addresses[0].email_address,
        name: [first_name, last_name].filter(Boolean).join(' '),
        imageUrl: image_url
      });

      return NextResponse.json({
        error: 'Error upserting user in database'
      }, { status: 500 });
    }
  }

  return NextResponse.json({ 
    message: 'Webhook received successfully' 
  }, { status: 200 });
}