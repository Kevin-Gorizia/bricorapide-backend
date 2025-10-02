import { Router } from "express";
import Stripe from "stripe";
import { isAuth } from "../middleware/auth";
import express from "express";
const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil",
});

router.post("/create-payment-intent", isAuth, async (req: any, res) => {
  const { amountCents, reservationId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "eur",
    metadata: { reservationId: reservationId?.toString() || "" },
  });
  res.json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id });
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    res.status(200).send("ok");
  }
);

export default router;
