import { Router } from "express";
import { authGuard } from "./auth.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

const router = Router();

/**
 * 1) Get current user's cart (create if missing)
 */
router.get("/items", authGuard, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.sub }).populate("items.productId");
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 2) Add item to cart
 * Body: { productId, qty }
 */
router.post("/items", authGuard, async (req, res) => {
  const { productId, qty = 1 } = req.body;

  // 3) Fetch product to snapshot title & price
  const product = await Product.findById(productId);
  if (!product || !product.isActive) return res.status(404).json({ error: "Product not found" });

  // 4) Get or create cart
  let cart = await Cart.findOne({ userId: req.user.sub });
  if (!cart) cart = await Cart.create({ userId: req.user.sub, items: [] });

  // 5) Check if item already exists; update qty
  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx >= 0) {
    cart.items[idx].qty += qty;
  } else {
    cart.items.push({
      productId: product._id,
      titleSnapshot: product.title,
      priceSnapshot: product.price,
      qty
    });
  }

  // 6) Recompute totals
  const subtotal = cart.items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  const tax = 0; // for dev, keep 0 or flat rate
  const shipping = 0; // add logic later
  cart.totals = { subtotal, tax, shipping, grandTotal: subtotal + tax + shipping };

  // 7) Save and return
  await cart.save();
  res.status(201).json(cart);
});

/**
 * 8) Update item qty
 * Body: { qty }
 */
router.patch("/items/:itemId", authGuard, async (req, res) => {
  const { itemId } = req.params;
  const { qty } = req.body;

  const cart = await Cart.findOne({ userId: req.user.sub });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });

  item.qty = Math.max(1, Number(qty) || 1);

  const subtotal = cart.items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  cart.totals = { subtotal, tax: 0, shipping: 0, grandTotal: subtotal };

  await cart.save();
  res.json(cart);
});

/**
 * 9) Remove item
 */
router.delete("/items/:itemId", authGuard, async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ userId: req.user.sub });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });

  item.remove();

  const subtotal = cart.items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  cart.totals = { subtotal, tax: 0, shipping: 0, grandTotal: subtotal };

  await cart.save();
  res.json(cart);
});

export default router;
