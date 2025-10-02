import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../utils/stripeClient";
import { prisma } from "../lib/prisma";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await prisma.reservation.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: "CONFIRMED" as ReservationStatus },
      });

      console.log(
        `Paiement réussi et réservation(s) confirmée(s) : ${paymentIntent.id}`
      );
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Erreur Stripe webhook:", err.message || err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
