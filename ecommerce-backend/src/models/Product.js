// 1) Import mongoose to define a schema
import mongoose from "mongoose";
// 2) Import slugify to generate SEO-friendly slugs
import slugify from "slugify";

// 3) Define the Product schema (shape of product documents)
const productSchema = new mongoose.Schema(
  {
    // 4) Title: required string
    title: { type: String, required: true, trim: true },

    // 5) Description: optional string
    description: { type: String, default: "" },

    // 6) Price: number in INR (you can store currency separately later)
    price: { type: Number, required: true, min: 0 },

    // 7) Images: array of objects with URL and alt text
    images: [{ url: String, alt: String }],

    // 8) Inventory: stock quantity
    inventory: { type: Number, default: 0, min: 0 },

    // 9) Categories: store category IDs (we’ll define Category later)
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    // 10) Active flag to toggle visibility
    isActive: { type: Boolean, default: true },

    // 11) Slug: SEO-friendly unique identifier
    slug: { type: String, unique: true }
  },
  // 12) Timestamp fields (createdAt, updatedAt)
  { timestamps: true }
);

// 13) Pre-save hook: auto-generate slug from title if missing
productSchema.pre("save", async function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // no next() needed, async resolves automatically
});
// 14) Create a text index for search on title+description (optional dev feature)
productSchema.index({ title: "text", description: "text" });

// 15) Export the Mongoose model
export const Product = mongoose.model("Product", productSchema);