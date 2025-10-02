import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../utils/stripeClient";
import { prisma } from "../lib/prisma";

// Définition locale si tu veux éviter l'import de l'enum Prisma
type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    // Construction de l'événement Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Paiement réussi
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Paiement réussi:", paymentIntent.id);

      // Mettre à jour la réservation correspondante
      const reservation = await prisma.reservation.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: "CONFIRMED" as ReservationStatus },
      });

      if (reservation.count > 0) {
        console.log(
          `Réservation(s) mise(s) à jour pour le paiement ${paymentIntent.id}`
        );
      } else {
        console.warn(
          `Aucune réservation trouvée pour le paiement ${paymentIntent.id}`
        );
      }
    }

    // Ici tu peux gérer d'autres types d'événements Stripe
    // ex: payment_intent.payment_failed, charge.refunded, etc.

    res.json({ received: true });
  } catch (err: any) {
    console.error("Erreur traitement webhook Stripe:", err.message || err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
