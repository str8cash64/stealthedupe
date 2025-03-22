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
  finish?: string;
  rating?: {
    average: number;
    count: number;
  };
  reviews?: {
    reddit?: Array<{
      text: string;
      rating: number;
      date: Date;
      url?: string;
    }>;
    expert?: Array<{
      source: string;
      rating: number;
      quote: string;
      date: Date;
      url?: string;
    }>;
  };
  availability?: {
    inStock: boolean;
    lastChecked: Date;
    retailers?: Array<{
      name: string;
      price: number;
      url: string;
      inStock: boolean;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    brand: { 
      type: String, 
      required: true,
      trim: true
    },
    category: { 
      type: String, 
      required: true,
      enum: ['lipstick', 'foundation', 'mascara', 'eyeshadow', 'blush', 'concealer', 'powder', 'bronzer', 'highlighter', 'eyeliner', 'lip gloss', 'lip oil', 'moisturizer', 'serum', 'sunscreen', 'cleanser', 'toner', 'face mask', 'eye cream', 'primer', 'other'],
      trim: true
    },
    description: { 
      type: String,
      trim: true
    },
    price: {
      amount: { 
        type: Number,
        min: 0
      },
      currency: { 
        type: String, 
        default: 'USD',
        uppercase: true
      },
      lastUpdated: { 
        type: Date, 
        default: Date.now 
      }
    },
    imageUrl: { 
      type: String,
      trim: true
    },
    ingredients: [{ 
      type: String,
      trim: true
    }],
    sku: { 
      type: String,
      trim: true
    },
    url: { 
      type: String,
      trim: true
    },
    retailer: { 
      type: String,
      trim: true
    },
    color: { 
      type: String,
      trim: true
    },
    colorHex: { 
      type: String,
      trim: true,
      match: /^#[0-9A-Fa-f]{6}$/
    },
    finish: {
      type: String,
      enum: ['matte', 'satin', 'glossy', 'cream', 'metallic', 'other'],
      trim: true
    },
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        min: 0,
        default: 0
      }
    },
    reviews: {
      reddit: [{
        text: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        date: { type: Date, required: true },
        url: { type: String }
      }],
      expert: [{
        source: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 100 },
        quote: { type: String, required: true },
        date: { type: Date, required: true },
        url: { type: String }
      }]
    },
    availability: {
      inStock: { type: Boolean, default: false },
      lastChecked: { type: Date, default: Date.now },
      retailers: [{
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        url: { type: String, required: true },
        inStock: { type: Boolean, required: true }
      }]
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound indexes for faster lookups
ProductSchema.index({ brand: 1, name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ ingredients: 1 });
ProductSchema.index({ color: 1 });
ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ 'rating.average': -1 });
ProductSchema.index({ 'availability.inStock': 1 });

// Prevent duplicate products with same brand and name
ProductSchema.index({ brand: 1, name: 1 }, { unique: true });

// Virtual for price in USD
ProductSchema.virtual('priceUSD').get(function(this: IProduct) {
  if (!this.price) return null;
  if (this.price.currency === 'USD') return this.price.amount;
  // Add currency conversion logic here if needed
  return this.price.amount;
});

// Method to update price
ProductSchema.methods.updatePrice = async function(amount: number, currency: string = 'USD') {
  this.price = {
    amount,
    currency,
    lastUpdated: new Date()
  };
  return this.save();
};

// Static method to find products by price range
ProductSchema.statics.findByPriceRange = function(min: number, max: number) {
  return this.find({
    'price.amount': { $gte: min, $lte: max },
    'price.currency': 'USD'
  });
};

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 