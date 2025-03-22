import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';
import Product from '@/models/Product';
import { getPriceFromMultipleRetailers } from '@/utils/priceScraper';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get product ID from query parameters
    const productId = request.nextUrl.searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Find the product
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Get real-time prices from multiple retailers
    const priceResult = await getPriceFromMultipleRetailers(
      product.name,
      product.brand
    );
    
    if (!priceResult.success || !priceResult.data) {
      return NextResponse.json(
        { error: 'Failed to retrieve prices' },
        { status: 500 }
      );
    }
    
    // Sort prices from lowest to highest
    const sortedPrices = [...priceResult.data].sort((a, b) => {
      const priceA = a.price || Number.MAX_VALUE;
      const priceB = b.price || Number.MAX_VALUE;
      return priceA - priceB;
    });
    
    // Update the product's price if we have a better one
    if (sortedPrices.length > 0 && sortedPrices[0].price !== null) {
      const lowestPrice = sortedPrices[0];
      
      // Only update if we don't have a price or found a lower one
      if (!product.price?.amount || (lowestPrice.price !== null && lowestPrice.price < product.price.amount)) {
        product.price = {
          amount: lowestPrice.price as number,
          currency: lowestPrice.currency,
          lastUpdated: new Date(),
        };
        await product.save();
      }
    }
    
    // Format the response
    const formattedPrices = sortedPrices.map(price => ({
      retailer: price.retailer,
      price: price.price ? `$${price.price.toFixed(2)}` : 'Price not available',
      currency: price.currency,
      url: price.url,
      inStock: price.inStock,
      lastUpdated: price.lastUpdated,
    }));
    
    return NextResponse.json({
      success: true,
      product: {
        id: product._id,
        name: product.name,
        brand: product.brand,
      },
      prices: formattedPrices,
      lowestPrice: formattedPrices.length > 0 ? formattedPrices[0] : null,
    });
  } catch (error) {
    console.error('Error in prices API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 