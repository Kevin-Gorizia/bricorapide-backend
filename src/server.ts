import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Routes
import authRoutes from "./routes/auth";
import reservationsRoutes from "./routes/reservations";
import productsRoutes from "./routes/products";
import paymentsRoutes from "./routes/payments";
import stripeRoutes from "./routes/stripeRoute";

// Middlewares
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("⚠️ JWT_SECRET manquant dans .env");
  process.exit(1);
}

const app = express();
const prisma = new PrismaClient();

// Middlewares globaux
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/stripe", stripeRoutes);

// Test route
app.get("/", (req, res) => res.send("API Bricorapide backend is running 🚀"));

// Middleware global pour les erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
