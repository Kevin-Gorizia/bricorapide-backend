import { Router, Response } from "express";
import { isAuth, AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../middlewares/asyncHandler";
import { prisma } from "../lib/prisma";

const router = Router();

// Créer une réservation
router.post(
  "/",
  isAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non authentifié" });
    }

    const {
      nomClient,
      emailClient,
      service,
      surface,
      distanceKm,
      amountCents,
      stripePaymentIntentId,
      products,
    } = req.body;

    const reservation = await prisma.reservation.create({
      data: {
        user: { connect: { id: userId } }, // ✅ obligatoire pour Prisma
        nomClient,
        emailClient,
        service,
        surface,
        distanceKm,
        amountCents,
        stripePaymentIntentId,
        products: products
          ? { connect: products.map((id: number) => ({ id })) }
          : undefined,
      },
      include: { products: true, user: true },
    });

    res.json({ success: true, data: reservation });
  })
);

// Récupérer toutes les réservations
router.get(
  "/",
  isAuth,
  asyncHandler(async (req: import("express").Request, res: Response) => {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: { products: true, user: true },
    });
    res.json({ success: true, data: reservations });
  })
);

export default router;
