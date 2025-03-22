export enum MessageType {
  USER = 'user',
  AI = 'ai',
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number | string;
  image: string;
  link: string;
  ingredients?: string[];
  similarityScore?: number;
  ingredientMatch?: number;
  colorMatch?: number;
  finishMatch?: number;
  color?: string;
  colorHex?: string;
  redditReviews?: {
    text: string;
    rating: number;
    date: string;
  }[];
  expertReviews?: {
    source: string;
    rating: number;
    quote: string;
  };
}

export interface ComparedProduct {
  name: string;
  brand: string;
  price: number | string;
  ingredients?: string[];
  color?: string;
  colorHex?: string;
}

export interface AnalysisInsights {
  summary: string;
  colorAnalysis?: string;
  ingredientAnalysis?: string;
  priceComparison?: string;
  originalProduct?: {
    brand: string;
    name: string;
    price: number | string;
    color?: string;
  };
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  isTyping?: boolean;
  products?: Product[];
  analysisInsights?: AnalysisInsights;
  comparedTo?: ComparedProduct;
} 