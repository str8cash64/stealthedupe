import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: string;
  description?: string;
  price?: {
    amount: number;
    currency: string;
    lastUpdated: Date;
  };
  imageUrl?: string;
  ingredients: string[];
  sku?: string;
  url?: string;
  retailer?: string;
  color?: string;
  colorHex?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: {
      amount: { type: Number },
      currency: { type: String, default: 'USD' },
      lastUpdated: { type: Date, default: Date.now }
    },
    imageUrl: { type: String },
    ingredients: [{ type: String }],
    sku: { type: String },
    url: { type: String },
    retailer: { type: String },
    color: { type: String },
    colorHex: { type: String }
  },
  { timestamps: true }
);

// Create compound indexes for faster lookups
ProductSchema.index({ brand: 1, name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ ingredients: 1 });
ProductSchema.index({ color: 1 }); // Index for color searches

// Prevent duplicate products with same brand and name
ProductSchema.index({ brand: 1, name: 1 }, { unique: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 