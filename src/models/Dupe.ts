import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product';

export interface IDupe extends Document {
  originalProduct: IProduct['_id'];
  dupeProduct: IProduct['_id'];
  similarityScore: number;
  ingredientMatch: number;
  colorMatch: number;
  finishMatch: number;
  priceDifference: number;
  communityRating?: number;
  source: 'algorithm' | 'community' | 'manual';
  sourceDetails?: {
    platform?: string;
    url?: string;
    mentions?: number;
  };
  verifiedBy?: {
    count: number;
    users: Array<{
      userId: string;
      date: Date;
      rating: number;
      comment?: string;
    }>;
  };
  priceComparison?: {
    originalPrice: number;
    dupePrice: number;
    savings: number;
    lastUpdated: Date;
  };
  ingredientComparison?: {
    matchingIngredients: string[];
    missingIngredients: string[];
    extraIngredients: string[];
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DupeSchema: Schema = new Schema(
  {
    originalProduct: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    dupeProduct: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    similarityScore: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    },
    ingredientMatch: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    },
    colorMatch: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 100 
    },
    finishMatch: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 100 
    },
    priceDifference: { 
      type: Number, 
      required: true 
    },
    communityRating: { 
      type: Number, 
      min: 0, 
      max: 5 
    },
    source: { 
      type: String, 
      enum: ['algorithm', 'community', 'manual'], 
      required: true 
    },
    sourceDetails: {
      platform: { type: String },
      url: { type: String },
      mentions: { type: Number, default: 0 }
    },
    verifiedBy: {
      count: { type: Number, default: 0 },
      users: [{
        userId: { type: String, required: true },
        date: { type: Date, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String }
      }]
    },
    priceComparison: {
      originalPrice: { type: Number, required: true },
      dupePrice: { type: Number, required: true },
      savings: { type: Number, required: true },
      lastUpdated: { type: Date, default: Date.now }
    },
    ingredientComparison: {
      matchingIngredients: [{ type: String }],
      missingIngredients: [{ type: String }],
      extraIngredients: [{ type: String }],
      lastUpdated: { type: Date, default: Date.now }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for faster lookups
DupeSchema.index({ originalProduct: 1 });
DupeSchema.index({ dupeProduct: 1 });
DupeSchema.index({ similarityScore: -1 });
DupeSchema.index({ ingredientMatch: -1 });
DupeSchema.index({ priceDifference: 1 });
DupeSchema.index({ colorMatch: -1 });
DupeSchema.index({ 'verifiedBy.count': -1 });
DupeSchema.index({ 'priceComparison.savings': -1 });

// Prevent duplicate dupe relationships
DupeSchema.index(
  { originalProduct: 1, dupeProduct: 1 }, 
  { unique: true }
);

// Virtual for savings percentage
DupeSchema.virtual('savingsPercentage').get(function(this: IDupe) {
  if (!this.priceComparison) return null;
  return ((this.priceComparison.originalPrice - this.priceComparison.dupePrice) / this.priceComparison.originalPrice) * 100;
});

// Method to update price comparison
DupeSchema.methods.updatePriceComparison = async function(this: IDupe, originalPrice: number, dupePrice: number) {
  this.priceComparison = {
    originalPrice,
    dupePrice,
    savings: originalPrice - dupePrice,
    lastUpdated: new Date()
  };
  return this.save();
};

// Method to add user verification
DupeSchema.methods.addVerification = async function(this: IDupe, userId: string, rating: number, comment?: string) {
  if (!this.verifiedBy) {
    this.verifiedBy = { count: 0, users: [] };
  }
  
  // Check if user has already verified
  const existingVerification = this.verifiedBy.users.find((v: { userId: string }) => v.userId === userId);
  if (existingVerification) {
    existingVerification.rating = rating;
    existingVerification.comment = comment;
    existingVerification.date = new Date();
  } else {
    this.verifiedBy.users.push({
      userId,
      rating,
      comment,
      date: new Date()
    });
    this.verifiedBy.count += 1;
  }
  
  // Update community rating
  const totalRating = this.verifiedBy.users.reduce((sum: number, v: { rating: number }) => sum + v.rating, 0);
  this.communityRating = totalRating / this.verifiedBy.count;
  
  return this.save();
};

// Static method to find dupes by price range
DupeSchema.statics.findByPriceRange = function(min: number, max: number) {
  return this.find({
    'priceComparison.dupePrice': { $gte: min, $lte: max }
  });
};

export default mongoose.models.Dupe || mongoose.model<IDupe>('Dupe', DupeSchema); 