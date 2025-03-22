require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function listDatabases() {
  // Get the connection string without the database name
  const connectionString = process.env.MONGODB_URI;
  const baseConnectionString = connectionString.substring(0, connectionString.lastIndexOf('/'));
  
  console.log('Using base connection string:', baseConnectionString);
  
  const client = new MongoClient(baseConnectionString);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const databasesList = await client.db().admin().listDatabases();
    
    console.log('Available databases:');
    databasesList.databases.forEach(db => {
      console.log(` - ${db.name}`);
    });
    
  } catch (e) {
    console.error('Error listing databases:', e);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

listDatabases().catch(console.error); 