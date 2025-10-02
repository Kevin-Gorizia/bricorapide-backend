import { Router } from "express";
import Stripe from "stripe";
import { isAuth } from "../middlewares/auth";
import express from "express";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil",
});

// Créer un PaymentIntent
router.post("/create-payment-intent", isAuth, async (req: any, res) => {
  const { amountCents, reservationId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      metadata: { reservationId: reservationId?.toString() || "" },
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (err: any) {
    console.error("Erreur création PaymentIntent:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Erreur serveur" });
  }
});

// Webhook Stripe (raw nécessaire pour vérifier la signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    // Ici on laisse la gestion au stripeController
    res.status(200).send("ok");
  }
);

export default router;
