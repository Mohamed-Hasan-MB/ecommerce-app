import { Router } from "express";
import { authGuard } from "./auth.js";
import { roleGuard } from "./auth.js"; // you’ll define this
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

const router = Router();

// Create product
router.post("/products", authGuard, roleGuard("admin"), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put("/products/:id", authGuard, roleGuard("admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete("/products/:id", authGuard, roleGuard("admin"), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View all orders
router.get("/orders", authGuard, roleGuard("admin"), async (req, res) => {
  try {
    const orders = await Order.find().sort("-createdAt");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.patch("/orders/:id/status", authGuard, roleGuard("admin"), async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;