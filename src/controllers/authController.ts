import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateJWT } from "../utils/generateJWT";
// Fonction utilitaire pour valider le rôle
const getValidRole = (role: any): "ADMIN" | "USER" => (role === "ADMIN" ? "ADMIN" : "USER");

// ====================
// Inscription
// ====================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérification email existant
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });

    // Vérification mot de passe
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password))
      return res.status(400).json({ success: false, message: "Mot de passe trop faible" });

    // Hash du mot de passe
    const hashedPassword = await hashPassword(password);

    // Création utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: getValidRole(role), // ✅ rôle valide
      },
    });

    // Génération token JWT
    const token = generateJWT(user.id.toString());

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ====================
// Connexion
// ====================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ success: false, message: "Utilisateur non trouvé" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });

    const token = generateJWT(user.id.toString());
    const { password: _, ...userWithoutPassword } = user;

    res.json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
