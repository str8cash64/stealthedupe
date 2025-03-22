// Test script for StealthDupe API
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const API_BASE_URL = 'http://localhost:3000/api';

async function testBasicEndpoint() {
  try {
    console.log('Testing basic API endpoint...');
    const response = await axios.get(`${API_BASE_URL}/test`);
    console.log('API Status:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error testing basic API:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testMockSearchAPI() {
  try {
    console.log('Testing mock search API endpoint...');
    const response = await axios.post(`${API_BASE_URL}/test`, {
      query: 'Charlotte Tilbury Pillow Talk Lipstick',
      type: 'text'
    });
    console.log('Mock Search API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error testing mock search API:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testRealSearchAPI() {
  try {
    console.log('Testing real search API endpoint...');
    const response = await axios.post(`${API_BASE_URL}/search`, {
      query: 'Charlotte Tilbury Pillow Talk Lipstick',
      type: 'text'
    });
    console.log('Real Search API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error testing real search API:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function testDirectProductInsert() {
  try {
    console.log('Testing direct product insertion...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    // Connect to your MongoDB instance directly
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Extract the database name from the URI to avoid case sensitivity issues
    const uri = process.env.MONGODB_URI;
    const dbName = uri.substring(uri.lastIndexOf('/') + 1, uri.includes('?') ? uri.indexOf('?') : undefined);
    console.log('Using database:', dbName);
    
    const db = client.db(dbName);
    const products = db.collection('products');
    
    // Delete any existing products with the same name
    await products.deleteMany({
      name: { $in: ['Test Lipstick', 'Test Dupe Lipstick'] }
    });
    
    // Insert a test product
    const result = await products.insertMany([
      {
        name: 'Test Lipstick',
        brand: 'Test Brand',
        category: 'lipstick',
        description: 'A test lipstick',
        price: {
          amount: 20.00,
          currency: 'USD',
          lastUpdated: new Date()
        },
        ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test Dupe Lipstick',
        brand: 'Dupe Brand',
        category: 'lipstick',
        description: 'A dupe test lipstick',
        price: {
          amount: 8.99,
          currency: 'USD',
          lastUpdated: new Date()
        },
        ingredients: ['Ingredient 1', 'Similar Ingredient', 'Ingredient 3'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    console.log(`Inserted ${result.insertedCount} test products`);
    
    // Close the connection
    await client.close();
    console.log('Disconnected from MongoDB');
    
    return true;
  } catch (error) {
    console.error('Error inserting test products:', error.message);
    return false;
  }
}

async function runTests() {
  // First test the basic endpoint
  const basicResult = await testBasicEndpoint();
  
  if (basicResult && basicResult.success) {
    console.log('Basic API test successful');
    
    // Then test the mock search API
    const mockSearchResult = await testMockSearchAPI();
    
    if (mockSearchResult && mockSearchResult.success) {
      console.log('Mock search API test successful');
      
      // Finally, try the real search API if the mock one works
      try {
        const realSearchResult = await testRealSearchAPI();
        if (realSearchResult && realSearchResult.success) {
          console.log('Real search API test successful');
        }
      } catch (error) {
        console.log('Real search API test failed - this is expected if the database is not properly seeded');
      }
    }
  }
  
  console.log('API testing completed');
}

// Run the tests
runTests().catch(console.error); 