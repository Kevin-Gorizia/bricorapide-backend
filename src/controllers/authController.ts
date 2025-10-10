import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateJWT } from "../utils/generateJWT";
import { asyncHandler } from "../middlewares/asyncHandler";

const getValidRole = (role: any) => (role === "ADMIN" ? "ADMIN" : "USER");

export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérifier si l’utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email déjà utilisé" });

    // Vérifier la complexité du mot de passe
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password))
      return res
        .status(400)
        .json({ success: false, message: "Mot de passe trop faible" });

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l’utilisateur
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: getValidRole(role) },
    });

    // Générer le token
    const token = generateJWT(user.id);

    // Supprimer le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = user;

    res
      .status(201)
      .json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (err) {
    console.error("Erreur inscription:", err); // <-- log complet pour debug
    res
      .status(500)
      .json({ success: false, message: "Erreur interne", data: null });
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
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

  const token = generateJWT(user.id);
  const { password: _, ...userWithoutPassword } = user;

  res.json({ success: true, data: { user: userWithoutPassword, token } });
});
