import jwt from "jsonwebtoken";

export const generateJWT = (userId: string) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET manquant");
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
