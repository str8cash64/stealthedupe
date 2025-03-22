import mongoose from 'mongoose';

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Create a corrected URI with the proper database name case
function getCorrectConnectionString(uri: string): string {
  // Parse the connection string to get the parts
  const parts = uri.split('/');
  const dbNameWithParams = parts[parts.length - 1];
  const dbNameParts = dbNameWithParams.split('?');
  const queryParams = dbNameParts.length > 1 ? '?' + dbNameParts[1] : '';
  
  // Replace the database name with the correct case
  return uri.replace(dbNameWithParams, 'Stealthedupe' + queryParams);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Define the shape of our cached connection
interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize cached with proper typing
let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const correctedUri = getCorrectConnectionString(MONGODB_URI as string);
    console.log('Connecting to MongoDB database: Stealthedupe');
    
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(correctedUri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect; 