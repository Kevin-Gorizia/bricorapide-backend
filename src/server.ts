// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import paymentRoutes from "./routes/payments";
import reservationRoutes from "./routes/reservations";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("API Bricorapide backend is running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
