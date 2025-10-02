import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middlewares/asyncHandler";

// GET all
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: { reservations: true },
  });
  res.json({ success: true, data: products });
});

// GET by ID
export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { reservations: true },
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Produit non trouvé" });
    res.json({ success: true, data: product });
  }
);

// CREATE
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      imageUrl,
      category,
      priceCents,
      durationMinutes,
      stock,
      isActive,
    } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        category,
        priceCents: Number(priceCents),
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        stock: stock ? Number(stock) : undefined,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    res.status(201).json({ success: true, data: product });
  }
);

// UPDATE
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: any = req.body;
    if (data.priceCents) data.priceCents = Number(data.priceCents);
    if (data.durationMinutes)
      data.durationMinutes = Number(data.durationMinutes);
    if (data.stock) data.stock = Number(data.stock);

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });
    res.json({ success: true, data: product });
  }
);

// DELETE
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Produit supprimé" });
  }
);
