import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import reservationsRoutes from "./routes/reservations";
import paymentsRoutes from "./routes/payments";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/payments", paymentsRoutes);

export default app;
