import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { isAuth } from "../middlewares/auth";
import * as productController from "../controllers/productController";

const router = Router();

// Tous les produits
router.get("/", asyncHandler(productController.getProducts));

// Produit par ID
router.get("/:id", asyncHandler(productController.getProductById));

// CRUD (auth requis)
router.post("/", isAuth, asyncHandler(productController.createProduct));
router.put("/:id", isAuth, asyncHandler(productController.updateProduct));
router.delete("/:id", isAuth, asyncHandler(productController.deleteProduct));

export default router;
