// 1) Import packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// 2) Load environment variables from .env
dotenv.config();

// 3) Create the Express app
const app = express();

// 4) Allow JSON request bodies (e.g., POST with JSON)
app.use(express.json());

// 5) Enable CORS (so your React frontend can call this API)
app.use(cors({ origin: "*"})); // in dev, allow all. Later restrict.

// 6) Health check route to verify server is running
app.get("/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

// 7) Start the server on PORT from .env, fallback to 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});