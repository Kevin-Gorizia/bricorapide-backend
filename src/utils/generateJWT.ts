import jwt from "jsonwebtoken";

export const generateJWT = (userId: number) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET manquant");
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
