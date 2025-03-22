import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product';

export interface ISearch extends Document {
  query: string;
  queryType: 'text' | 'url' | 'image';
  productMatched?: IProduct['_id'];
  results: {
    productId: IProduct['_id'];
    position: number;
  }[];
  success: boolean;
  processingTime?: number;
  createdAt: Date;
}

const SearchSchema: Schema = new Schema(
  {
    query: { type: String, required: true },
    queryType: { 
      type: String, 
      enum: ['text', 'url', 'image'], 
      required: true 
    },
    productMatched: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product'
    },
    results: [{
      productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
      },
      position: { type: Number }
    }],
    success: { type: Boolean, default: true },
    processingTime: { type: Number }
  },
  { 
    timestamps: true,
    // Only keep createdAt, no updatedAt for search logs
    timeseries: {
      timeField: 'createdAt',
      metaField: 'queryType',
      granularity: 'hours'
    }
  }
);

// Create indexes for faster analytics and lookups
SearchSchema.index({ createdAt: -1 });
SearchSchema.index({ queryType: 1, createdAt: -1 });
SearchSchema.index({ query: 'text' }); // For searching within past searches

export default mongoose.models.Search || mongoose.model<ISearch>('Search', SearchSchema); 