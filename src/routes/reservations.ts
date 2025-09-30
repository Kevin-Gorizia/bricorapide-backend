import { Router } from "express";
import { prisma } from "../lib/prisma";
import { isAuth } from "../middleware/auth";
const router = Router();

router.post("/", isAuth, async (req: any, res) => {
  const userId = req.userId;
  const {
    nomClient,
    emailClient,
    service,
    surface,
    distanceKm,
    amountCents,
    stripePaymentIntentId,
  } = req.body;
  const created = await prisma.reservation.create({
    data: {
      userId,
      nomClient,
      emailClient,
      service,
      surface,
      distanceKm,
      amountCents,
      stripePaymentIntentId,
    },
  });
  res.json(created);
});

router.get("/", isAuth, async (req: any, res) => {
  const list = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(list);
});

export default router;
