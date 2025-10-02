import { Request, Response } from "express";
import prisma from "../config/prismaClient";

export const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.json({ success: true, data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Produit non trouvé" });
  res.json({ success: true, data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const product = await prisma.product.create({
    data: { name, description, price: Number(price) },
  });
  res.status(201).json({ success: true, data: product });
};
