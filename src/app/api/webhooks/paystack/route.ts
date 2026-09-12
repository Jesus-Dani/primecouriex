import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/confirm-payment";

// TRD §6: payment confirmation must be verified server-side, not trusted
// from the client alone. This webhook is the async path (fires even if the
// customer closes the tab before the callback-page redirect completes);
// the callback page's own verify call (src/app/booking/confirmation/[ref]/
// page.tsx) is the synchronous path for instant UI feedback. Both end up
// calling the same confirmPayment() so a booking gets marked paid exactly
// once regardless of which arrives first.
export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const signature = request.headers.get("x-paystack-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const isValid =
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    await confirmPayment(event.data.reference, event.data.status, event.data.amount);
  }

  return NextResponse.json({ received: true });
}
