import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = Router();

/**
 * 1) Register user
 * Body: { name, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 2) Validate minimal fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 3) Check if email is already registered
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    // 4) Hash password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // 5) Create user document
    const user = await User.create({ name, email, passwordHash });

    // 6) Return basic user info (never return passwordHash)
    res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * 7) Login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 8) Validate
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // 9) Find user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // 10) Compare password with stored hash
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  // 11) Create a JWT token carrying user id and roles
  const token = jwt.sign(
    { sub: user._id.toString(), roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // token valid for 1 hour
  );

  // 12) Respond with token and basic user info
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, roles: user.roles } });
});

/**
 * 13) Auth middleware to protect routes
 */
export function authGuard(req, res, next) {
  // 14) Read Authorization: Bearer <token>
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing Authorization header" });

  const [, token] = auth.split(" ");
  try {
    // 15) Verify token; attach user payload to req.user
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, roles, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default router;
