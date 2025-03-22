import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client directly in this file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    console.log(`Processing query: ${query}`);
    console.log(`OpenAI API Key exists: ${!!process.env.OPENAI_API_KEY}`);
    
    // Check if OpenAI API key is properly configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    try {
      // Use a simpler prompt with the latest GPT model
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Using a widely available model
        messages: [
          {
            role: 'system',
            content: 'You extract beauty product information from text.'
          },
          {
            role: 'user',
            content: `Extract basic information about this beauty product: "${query}"
              Return ONLY a JSON object with these fields:
              - productName: the product name
              - brand: the brand name
              - category: the product category (e.g., lipstick, foundation)
            `
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });
      
      console.log('OpenAI response received');
      const content = response.choices[0].message.content;
      console.log(`Response content: ${content}`);
      
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }
      
      const productInfo = JSON.parse(content);
      
      return NextResponse.json({
        success: true,
        productInfo,
        rawQuery: query
      });
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      return NextResponse.json(
        { 
          error: 'Error processing with OpenAI', 
          details: error.message,
          stack: error.stack
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred', 
        details: error.message 
      },
      { status: 500 }
    );
  }
} 