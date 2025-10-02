import express from "express";
import { stripeWebhook } from "../controllers/stripeController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = express.Router();

// Webhook Stripe (doit rester raw pour vérifier la signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(stripeWebhook)
);

export default router;
