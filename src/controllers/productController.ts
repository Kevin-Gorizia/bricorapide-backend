import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Récupérer tous les produits
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { reservations: true },
    });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des produits" });
  }
};

// Récupérer un produit par ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { reservations: true },
    });
    if (!product)
      return res.status(404).json({ success: false, message: "Produit non trouvé" });
    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Créer un produit
export const createProduct = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la création du produit" });
  }
};

// Mettre à jour un produit
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        imageUrl,
        category,
        priceCents: priceCents ? Number(priceCents) : undefined,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        stock: stock ? Number(stock) : undefined,
        isActive,
      },
    });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du produit" });
  }
};

// Supprimer un produit
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression du produit" });
  }
};
