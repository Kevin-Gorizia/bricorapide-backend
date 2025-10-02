import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getOrders = async (req: Request, res: Response) => {
  const orders = await prisma.reservation.findMany({
    include: { products: true },
  });
  res.json({ success: true, data: orders });
};

export const createOrder = async (req: Request, res: Response) => {
  const { userId, products } = req.body;

  const order = await prisma.reservation.create({
    data: {
      userId,
      products: { connect: products.map((p: number) => ({ id: p })) },
    },
    include: { products: true },
  });

  res.status(201).json({ success: true, data: order });
};
