// 1) Import mongoose to define a schema
import mongoose from "mongoose";

// 2) Define the Product schema (shape of product documents)
const productSchema = new mongoose.Schema(
  {
    // 3) Title: required string
    title: { type: String, required: true, trim: true },

    // 4) Description: optional string
    description: { type: String, default: "" },

    // 5) Price: number in INR (you can store currency separately later)
    price: { type: Number, required: true, min: 0 },

    // 6) Images: array of objects with URL and alt text
    images: [{ url: String, alt: String }],

    // 7) Inventory: stock quantity
    inventory: { type: Number, default: 0, min: 0 },

    // 8) Categories: store category IDs (we’ll define Category later)
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    // 9) Active flag to toggle visibility
    isActive: { type: Boolean, default: true },

    // 10) Slug: SEO-friendly unique identifier
    slug: { type: String, unique: true, index: true }
  },
  // 11) Timestamp fields (createdAt, updatedAt)
  { timestamps: true }
);

// 12) Create a text index for search on title+description (optional dev feature)
productSchema.index({ title: "text", description: "text" });

// 13) Export the Mongoose model
export const Product = mongoose.model("Product", productSchema);
