// 1) Import packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 2) Load environment variables from .env
dotenv.config();
import { connectMongo } from "./src/db/mongo.js";
import productsRouter from "./src/routes/products.js";
import authRouter, { authGuard } from "./src/routes/auth.js";
import cartRouter from "./src/routes/cart.js";

// 3) Create the Express app
const app = express();
app.use(express.json());
app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/cart", cartRouter);

app.get("/me", authGuard, (req, res) => {
  res.json({ userId: req.user.sub, roles: req.user.roles });
});//auth guard example

// 5) Enable CORS (so your React frontend can call this API)
app.use(cors({ origin: "*"})); // in dev, allow all. Later restrict.

// 6) Health check route to verify server is running
app.get("/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// Connect to DB before starting routes (optional: await in startup)
connectMongo(process.env.MONGO_URI).catch((err) => {
  console.error("Mongo connection error:", err.message);
  process.exit(1);
});

// 7) Start the server on PORT from .env, fallback to 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});