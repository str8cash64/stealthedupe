import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';
import Product from '@/models/Product';
import Dupe from '@/models/Dupe';
import Search from '@/models/Search';
import { extractProductInfo } from '@/utils/openai';
import { getPriceFromMultipleRetailers, extractIngredientsFromUrl } from '@/utils/priceScraper';

export async function POST(request: NextRequest) {
  try {
    console.log('Search API called');
    await dbConnect();
    console.log('Connected to database');
    
    const startTime = Date.now();
    const { query, type = 'text' } = await request.json();
    
    console.log(`Processing search query: "${query}" (type: ${type})`);
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Log the search request
    const searchLog = new Search({
      query,
      queryType: type,
      success: true,
    });
    
    // Step 1: Extract product information using OpenAI
    console.log('Extracting product info via OpenAI');
    const productInfoResult = await extractProductInfo(query);
    console.log('OpenAI extraction result:', productInfoResult);
    
    if (!productInfoResult.success) {
      console.error('Failed to extract product info:', productInfoResult.error);
      searchLog.success = false;
      await searchLog.save();
      
      return NextResponse.json(
        { error: 'Failed to extract product information' },
        { status: 500 }
      );
    }
    
    const { productName, brand, category } = productInfoResult.data;
    console.log(`Extracted product: ${brand} ${productName} (${category})`);
    
    // Step 2: Search for the original product in our database
    console.log('Searching for original product in database');
    const searchQuery: any = {};
    
    // Only add these fields to the search query if they're defined
    if (productName) {
      searchQuery.name = { $regex: productName, $options: 'i' };
    }
    if (brand) {
      searchQuery.brand = { $regex: brand, $options: 'i' };
    }
    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }
    
    // If we have any search criteria, execute the search
    let originalProduct = null;
    if (Object.keys(searchQuery).length > 0) {
      originalProduct = await Product.findOne(searchQuery);
      console.log('Search result:', originalProduct ? 'Found match' : 'No match found');
    } else {
      console.log('No search criteria available');
    }
    
    // If product not found, try to create it (in a real implementation, you'd have more validation)
    if (!originalProduct && type === 'url') {
      // Try to extract ingredients from URL
      const ingredientsResult = await extractIngredientsFromUrl(query);
      const ingredients = ingredientsResult.success ? ingredientsResult.ingredients : [];
      
      // Get price information
      const priceResult = await getPriceFromMultipleRetailers(productName, brand);
      
      const priceInfo = priceResult.success && priceResult.data && priceResult.data.length > 0
        ? {
            amount: priceResult.data[0].price || 0,
            currency: priceResult.data[0].currency,
            lastUpdated: new Date(),
          }
        : undefined;
      
      // Create a new product
      originalProduct = await Product.create({
        name: productName,
        brand,
        category: category || 'Unknown',
        ingredients: ingredients || [],
        price: priceInfo,
        url: type === 'url' ? query : undefined,
      });
    }
    
    // Step 3: Find dupes for this product
    let dupes = [];
    
    if (originalProduct) {
      searchLog.productMatched = originalProduct._id;
      
      // Find dupes where this product is the original
      dupes = await Dupe.find({ originalProduct: originalProduct._id })
        .populate('dupeProduct')
        .sort({ similarityScore: -1 })
        .limit(10);
      
      // If no dupes found, look for similar products by category
      if (dupes.length === 0) {
        const similarProducts = await Product.find({
          category: originalProduct.category,
          _id: { $ne: originalProduct._id },
          brand: { $ne: originalProduct.brand },
        }).limit(5);
        
        // For demonstration purposes, create mock dupe relationships
        // In a real implementation, you'd do a proper similarity analysis
        dupes = similarProducts.map(product => ({
          dupeProduct: product,
          similarityScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          ingredientMatch: Math.floor(Math.random() * 40) + 60, // Random match between 60-100
          priceDifference: 
            (originalProduct.price?.amount || 0) - (product.price?.amount || 0),
          source: 'algorithm',
        }));
      }
    } else {
      // No matching product found, return mock results based on category
      const categoryProducts = await Product.find({
        category: { $regex: category || 'makeup', $options: 'i' },
      }).limit(5);
      
      dupes = categoryProducts.map(product => ({
        dupeProduct: product,
        similarityScore: Math.floor(Math.random() * 30) + 70,
        ingredientMatch: Math.floor(Math.random() * 40) + 60,
        priceDifference: 0, // Cannot calculate without original product
        source: 'algorithm',
      }));
    }
    
    // Record the results in the search log
    searchLog.results = dupes.map((dupe, index) => ({
      productId: dupe.dupeProduct._id,
      position: index + 1,
    }));
    
    searchLog.processingTime = Date.now() - startTime;
    await searchLog.save();
    
    // Format the response
    const formattedResults = dupes.map(dupe => {
      const dupeProduct = dupe.dupeProduct;
      return {
        id: dupeProduct._id,
        name: dupeProduct.name,
        brand: dupeProduct.brand,
        price: dupeProduct.price?.amount 
          ? `$${dupeProduct.price.amount.toFixed(2)}` 
          : 'Price not available',
        imageUrl: dupeProduct.imageUrl || 'https://via.placeholder.com/150',
        similarityScore: dupe.similarityScore,
        ingredientMatch: dupe.ingredientMatch,
        priceDifference: dupe.priceDifference,
        url: dupeProduct.url || '',
      };
    });
    
    return NextResponse.json({
      success: true,
      originalProduct: originalProduct 
        ? {
            id: originalProduct._id,
            name: originalProduct.name,
            brand: originalProduct.brand,
            price: originalProduct.price?.amount 
              ? `$${originalProduct.price.amount.toFixed(2)}` 
              : 'Price not available',
            imageUrl: originalProduct.imageUrl || 'https://via.placeholder.com/150',
          } 
        : null,
      dupes: formattedResults,
      processingTime: searchLog.processingTime,
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 