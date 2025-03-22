import { NextRequest, NextResponse } from 'next/server';

// This is a simple test endpoint that doesn't interact with the database
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API is working correctly',
    env: {
      mongoDBConfigured: process.env.MONGODB_URI ? true : false,
      openAIConfigured: process.env.OPENAI_API_KEY ? true : false,
      nodeEnv: process.env.NODE_ENV
    },
    timestamp: new Date().toISOString()
  });
}

// This simulates a product search response
export async function POST(request: NextRequest) {
  try {
    const { query, type = 'text' } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Mock product and dupe data
    const mockOriginalProduct = {
      id: 'mock-product-1',
      name: 'Pillow Talk Matte Revolution Lipstick',
      brand: 'Charlotte Tilbury',
      price: '$34.00',
      imageUrl: 'https://www.charlottetilbury.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/m/a/matte-revolution-pillow-talk-lipstick-packshot-1_1_1.png',
    };
    
    const mockDupes = [
      {
        id: 'mock-dupe-1',
        name: 'Super Stay Matte Ink Liquid Lipstick',
        brand: 'Maybelline',
        price: '$9.99',
        imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/lip-makeup/lip-color/superstay-matte-ink-liquid-lipstick/maybelline-matte-ink-liquid-lipstick-lover-70-041554515398-o.jpg',
        similarityScore: 78,
        ingredientMatch: 75,
        priceDifference: 24.01,
        url: 'https://www.maybelline.com/lip-makeup/lipstick/superstay-matte-ink-liquid-lipstick',
      },
      {
        id: 'mock-dupe-2',
        name: 'SuperStay 24 Color Lipstick',
        brand: 'Maybelline',
        price: '$10.99',
        imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/lip-makeup/lip-color/superstay-24-2-step-liquid-lipstick/maybelline-liquid-lip-super-stay-24-hr-keep-it-red.jpg',
        similarityScore: 72,
        ingredientMatch: 68,
        priceDifference: 23.01,
        url: 'https://www.maybelline.com/lip-makeup/lipstick/superstay-24-liquid-lipstick',
      },
    ];
    
    // Return mock response
    return NextResponse.json({
      success: true,
      originalProduct: mockOriginalProduct,
      dupes: mockDupes,
      processingTime: 1234,
      query,
      type
    });
  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 