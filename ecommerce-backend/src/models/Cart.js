import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // 1) Link cart to a user
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 2) Items array with product snapshot
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        titleSnapshot: String,
        priceSnapshot: Number,
        qty: { type: Number, default: 1, min: 1 }
      }
    ],

    // 3) Totals for quick display (compute server-side)
    totals: {
      subtotal: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 }
    },

    // 4) Currency code
    currency: { type: String, default: "INR" }
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
