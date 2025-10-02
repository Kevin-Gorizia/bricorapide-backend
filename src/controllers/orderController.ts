import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middlewares/asyncHandler";

// GET all
export const getReservations = asyncHandler(
  async (req: Request, res: Response) => {
    const reservations = await prisma.reservation.findMany({
      include: { user: true, products: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: reservations });
  }
);

// GET by ID
export const getReservationById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
      include: { user: true, products: true },
    });
    if (!reservation)
      return res
        .status(404)
        .json({ success: false, message: "Réservation non trouvée" });
    res.json({ success: true, data: reservation });
  }
);

// CREATE
export const createReservation = asyncHandler(
  async (req: any, res: Response) => {
    const {
      nomClient,
      emailClient,
      service,
      surface,
      distanceKm,
      amountCents,
      products,
      scheduledAt,
      notes,
    } = req.body;
    const userId = req.userId;

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        nomClient,
        emailClient,
        service,
        surface,
        distanceKm,
        amountCents,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
        products: products
          ? { connect: products.map((id: number) => ({ id })) }
          : undefined,
      },
      include: { products: true, user: true },
    });

    res.status(201).json({ success: true, data: reservation });
  }
);

// UPDATE
export const updateReservation = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: any = req.body;
    if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);

    const reservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        ...data,
        products: data.products
          ? { set: data.products.map((id: number) => ({ id })) }
          : undefined,
      },
      include: { products: true, user: true },
    });

    res.json({ success: true, data: reservation });
  }
);

// DELETE
export const deleteReservation = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.reservation.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Réservation supprimée" });
  }
);
