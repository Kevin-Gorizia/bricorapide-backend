import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validate } from "../middlewares/validateRequest";
import { registerSchema, loginSchema } from "../schemas/authSchema";
import * as authController from "../controllers/authController";

const router = Router();

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
