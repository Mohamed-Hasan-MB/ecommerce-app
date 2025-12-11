import mongoose from "mongoose";

// 1) Define User schema
const userSchema = new mongoose.Schema(
  {
    // 2) Name: optional
    name: { type: String, trim: true },

    // 3) Email: required, unique for login
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // 4) Password hash: store hashed, never plaintext
    passwordHash: { type: String, required: true },

    // 5) Roles: for permissions (e.g., admin/customer)
    roles: { type: [String], default: ["customer"] },

    // 6) Addresses: basic structure for later
    addresses: [
      {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

// 7) Unique index on email
userSchema.index({ email: 1 }, { unique: true });

// 8) Compile model
export const User = mongoose.model("User", userSchema);
