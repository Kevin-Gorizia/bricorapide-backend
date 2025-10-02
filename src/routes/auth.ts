import { Router } from "express";
import { validate } from "../middlewares/validateRequest";
import { registerSchema } from "../schemas/authSchema";
import { loginSchema } from "../schemas/authSchema";
import { asyncHandler } from "../middlewares/asyncHandler";
import * as authController from "../controllers/authController";

const router = Router();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET manquant dans .env");
const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register)
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login)
);

export default router;
