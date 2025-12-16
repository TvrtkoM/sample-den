import { getCartSamplesIds } from "@/lib/db";
import { fetchSamplesByIds } from "@/lib/fetch/samples";
import { getSession } from "@/lib/getSession";
import { stripe } from "@/lib/stripe/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to checkout" },
        { status: 401 }
      );
    }

    const cartSamplesIds = await getCartSamplesIds();
    if (cartSamplesIds.length === 0) {
      console.log('cart empty', cartSamplesIds);
      return NextResponse.json(
        { error: "Your cart is empty" },
        { status: 400 }
      );
    }

    const samples = await fetchSamplesByIds(cartSamplesIds);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = samples.map(
      (sample) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: sample.title ?? "Untitled Sample",
            metadata: {
              sampleId: sample._id,
            },
          },
          unit_amount: Math.round((sample.priceUsd ?? 0) * 100),
        },
        quantity: 1,
      })
    );

    const reqHeaders = await headers();
    const origin = reqHeaders.get("origin") ?? "";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: lineItems,
      metadata: {
        userId: session.user.id,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/canceled`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode ?? 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}