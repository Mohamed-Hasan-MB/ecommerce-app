import { Router } from "express";
import { authGuard } from "./auth.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const router = Router();

/**
 * 1) Create order from current cart (mock payment)
 */
router.post("/", authGuard, async (req, res) => {
  // 2) Load user cart
  const cart = await Cart.findOne({ userId: req.user.sub });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  // 3) Create order document from cart
  const order = await Order.create({
    userId: req.user.sub,
    items: cart.items.map(i => ({
      productId: i.productId,
      titleSnapshot: i.titleSnapshot,
      priceSnapshot: i.priceSnapshot,
      qty: i.qty
    })),
    totals: cart.totals,
    status: "created",
    payment: { provider: "mock", status: "pending" }
  });

  // 4) Reduce inventory (simple decrement)
  for (const i of cart.items) {
    await Product.findByIdAndUpdate(i.productId, { $inc: { inventory: -i.qty } });
  }

  // 5) Clear cart
  cart.items = [];
  cart.totals = { subtotal: 0, tax: 0, shipping: 0, grandTotal: 0 };
  await cart.save();

  // 6) Respond with order
  res.status(201).json(order);
});

/**
 * 7) List my orders
 */
router.get("/", authGuard, async (req, res) => {
  const orders = await Order.find({ userId: req.user.sub }).sort("-createdAt");
  res.json(orders);
});

export default router;
