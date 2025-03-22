import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    // Check if the environment variable is available
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Using a different model to test
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello world" }
      ],
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'OpenAI API is working!',
      response: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unknown error',
      details: typeof error === 'object' ? Object.keys(error) : typeof error
    }, { status: 500 });
  }
} 