import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateJWT } from "../utils/generateJWT";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: "Email déjà utilisé" });

  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password))
    return res
      .status(400)
      .json({ success: false, message: "Mot de passe trop faible" });

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = generateJWT(user.id.toString());

  const { password: _, ...userWithoutPassword } = user;

  res
    .status(201)
    .json({ success: true, data: { user: userWithoutPassword, token } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Utilisateur non trouvé" });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch)
    return res
      .status(400)
      .json({ success: false, message: "Mot de passe incorrect" });

  const token = generateJWT(user.id.toString());

  const { password: _, ...userWithoutPassword } = user;

  res.json({ success: true, data: { user: userWithoutPassword, token } });
};
