import { Router } from "express";
import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import * as stripeController from "../controllers/stripeController";

const router = Router();

// Webhook Stripe (raw nécessaire pour vérifier la signature)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(stripeController.stripeWebhook)
);

export default router;
