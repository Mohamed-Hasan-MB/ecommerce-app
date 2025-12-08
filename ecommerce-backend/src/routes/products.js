// 1) Import express and Product model
import { Router } from "express";
import { Product } from "../models/Product.js";

// 2) Create a router instance
const router = Router();

/**
 * 3) Create product (Admin action in real apps)
 * Body: { title, price, description, images, inventory, slug }
 */
router.post("/", async (req, res) => {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc); // 4) Respond with created product
  } catch (err) {
    res.status(400).json({ error: err.message }); // 5) Validation or duplication errors
  }
});

/**
 * 6) List products with optional query params: search, page, limit
 */
router.get("/", async (req, res) => {
  const { search = "", page = 1, limit = 12 } = req.query;

  // 7) Build query object
  const q = {};
  if (search) q.$text = { $search: search };

  // 8) Fetch products with pagination
  const products = await Product.find(q)
    .sort("-createdAt")
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .select("title price images slug isActive");

  // 9) Total count for pagination UI
  const total = await Product.countDocuments(q);

  // 10) Respond with data and pagination meta
  res.json({
    data: products,
    page: Number(page),
    total,
    pages: Math.ceil(total / Number(limit))
  });
});

/**
 * 11) Get single product by slug
 */
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const doc = await Product.findOne({ slug });
  if (!doc) return res.status(404).json({ error: "Product not found" });
  res.json(doc);
});

/**
 * 12) Update product by id (Admin)
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const doc = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: "Product not found" });
  res.json(doc);
});

/**
 * 13) Delete product by id (Admin)
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const doc = await Product.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ error: "Product not found" });
  res.json({ ok: true });
});

// 14) Export router
export default router;
