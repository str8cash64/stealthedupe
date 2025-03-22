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
    }
  },
  { timestamps: true }
);

// Create indexes for faster lookups
DupeSchema.index({ originalProduct: 1 });
DupeSchema.index({ dupeProduct: 1 });
DupeSchema.index({ similarityScore: -1 }); // For sorting by similarity
DupeSchema.index({ ingredientMatch: -1 }); // For sorting by ingredient match
DupeSchema.index({ priceDifference: 1 }); // For sorting by price difference
DupeSchema.index({ colorMatch: -1 });

// Prevent duplicate dupe relationships
DupeSchema.index(
  { originalProduct: 1, dupeProduct: 1 }, 
  { unique: true }
);

export default mongoose.models.Dupe || mongoose.model<IDupe>('Dupe', DupeSchema); 