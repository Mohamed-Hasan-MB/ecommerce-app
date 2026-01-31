import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        titleSnapshot: String,
        priceSnapshot: Number,
        qty: Number
      }
    ],
    totals: {
      subtotal: Number,
      tax: Number,
      shipping: Number,
      grandTotal: Number
    },
    status: {
      type: String,
      enum: ["created", "paid", "shipped", "delivered", "cancelled", "refunded"],
      default: "created"
    },
    payment: {
      provider: { type: String, default: "mock" },
      status: { type: String, default: "pending" }
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
