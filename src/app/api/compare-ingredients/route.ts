import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';
import Product from '@/models/Product';
import Dupe from '@/models/Dupe';
import { compareIngredients } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { originalProductId, dupeProductId } = await request.json();
    
    if (!originalProductId || !dupeProductId) {
      return NextResponse.json(
        { error: 'Both originalProductId and dupeProductId are required' },
        { status: 400 }
      );
    }
    
    // Fetch both products
    const originalProduct = await Product.findById(originalProductId);
    const dupeProduct = await Product.findById(dupeProductId);
    
    if (!originalProduct || !dupeProduct) {
      return NextResponse.json(
        { error: 'One or both products not found' },
        { status: 404 }
      );
    }
    
    // Check if products have ingredients lists
    if (!originalProduct.ingredients || !originalProduct.ingredients.length ||
        !dupeProduct.ingredients || !dupeProduct.ingredients.length) {
      return NextResponse.json(
        { error: 'One or both products do not have ingredients lists' },
        { status: 400 }
      );
    }
    
    // Compare ingredients using OpenAI
    const comparisonResult = await compareIngredients(
      originalProduct.ingredients,
      dupeProduct.ingredients
    );
    
    if (!comparisonResult.success) {
      return NextResponse.json(
        { error: 'Failed to compare ingredients' },
        { status: 500 }
      );
    }
    
    const { similarityScore, keyMatches, keyDifferences, overallAnalysis, potentialIssues } = comparisonResult.data;
    
    // Check if a dupe relationship already exists
    let dupeRelationship = await Dupe.findOne({
      originalProduct: originalProductId,
      dupeProduct: dupeProductId,
    });
    
    // Calculate price difference if both products have prices
    const priceDifference = 
      originalProduct.price?.amount && dupeProduct.price?.amount
        ? originalProduct.price.amount - dupeProduct.price.amount
        : 0;
    
    // Update or create the dupe relationship
    if (dupeRelationship) {
      dupeRelationship.similarityScore = similarityScore;
      dupeRelationship.ingredientMatch = similarityScore; // Using same score for demo
      dupeRelationship.priceDifference = priceDifference;
      await dupeRelationship.save();
    } else {
      dupeRelationship = await Dupe.create({
        originalProduct: originalProductId,
        dupeProduct: dupeProductId,
        similarityScore,
        ingredientMatch: similarityScore, // Using same score for demo
        priceDifference,
        source: 'algorithm',
      });
    }
    
    return NextResponse.json({
      success: true,
      originalProduct: {
        id: originalProduct._id,
        name: originalProduct.name,
        brand: originalProduct.brand,
        ingredients: originalProduct.ingredients,
      },
      dupeProduct: {
        id: dupeProduct._id,
        name: dupeProduct.name,
        brand: dupeProduct.brand,
        ingredients: dupeProduct.ingredients,
      },
      comparison: {
        similarityScore,
        keyMatches,
        keyDifferences,
        overallAnalysis,
        potentialIssues,
        priceDifference,
      },
      dupeRelationshipId: dupeRelationship._id,
    });
  } catch (error) {
    console.error('Error in compare-ingredients API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 