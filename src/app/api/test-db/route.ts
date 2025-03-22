import { NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Test DB endpoint called');
    
    // Connect to MongoDB
    await dbConnect();
    console.log('Connected to database');
    
    // Get a list of all collections
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Count documents in each collection
    const stats: Record<string, number> = {};
    for (const name of collectionNames) {
      const count = await db.collection(name).countDocuments();
      stats[name] = count;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      collections: collectionNames,
      stats,
      databaseName: db.databaseName
    });
  } catch (error: unknown) {
    console.error('Error testing database:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
} 