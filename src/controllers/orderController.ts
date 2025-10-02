import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ReservationStatus } from "@prisma/client";

// Récupérer toutes les réservations
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.reservation.findMany({
      include: { user: true },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Récupérer une réservation par ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.reservation.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Réservation non trouvée" });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Créer une réservation
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      nomClient,
      emailClient,
      service,
      surface,
      distanceKm,
      amountCents,
      status,
      stripePaymentIntentId,
      scheduledAt,
      notes,
      products,
    } = req.body;

    const order = await prisma.reservation.create({
      data: {
        userId,
        nomClient,
        emailClient,
        service,
        surface,
        distanceKm,
        amountCents,
        status: status || ReservationStatus.PENDING,
        stripePaymentIntentId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
        products: { connect: products.map((p: number) => ({ id: p })) },
      },
      include: { products: true, user: true },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la réservation",
    });
  }
};

// Mettre à jour une réservation
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nomClient,
      emailClient,
      service,
      surface,
      distanceKm,
      amountCents,
      status,
      stripePaymentIntentId,
      scheduledAt,
      notes,
      products,
    } = req.body;

    const order = await prisma.reservation.update({
      where: { id: Number(id) },
      data: {
        nomClient,
        emailClient,
        service,
        surface,
        distanceKm,
        amountCents,
        status,
        stripePaymentIntentId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
        products: products
          ? { set: products.map((p: number) => ({ id: p })) }
          : undefined,
      },
      include: { products: true, user: true },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la réservation",
    });
  }
};

// Supprimer une réservation
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.reservation.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Réservation supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la réservation",
    });
  }
};
