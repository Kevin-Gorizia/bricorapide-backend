import { Request, Response } from "express";
import stripe from "../utils/stripeClient";

export const stripeWebhook = (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Exemple : traitement d'un paiement réussi
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("Paiement réussi:", paymentIntent.id);
  }

  res.json({ received: true });
};
