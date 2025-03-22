require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define the schemas directly here since we can't easily import the models in the script
// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  ingredients: [{ type: String }],
  price: {
    amount: { type: Number },
    currency: { type: String, default: 'USD' },
    lastUpdated: { type: Date, default: Date.now }
  },
  imageUrl: { type: String },
  url: { type: String },
  availabilityStatus: { type: String, enum: ['In Stock', 'Out of Stock', 'Limited'] },
  ratingAverage: { type: Number, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 }
});

// Dupe Schema
const dupeSchema = new mongoose.Schema({
  originalProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  dupeProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  similarityScore: { type: Number, min: 0, max: 100 },
  ingredientMatch: { type: Number, min: 0, max: 100 },
  priceDifference: { type: Number },
  communityRating: { type: Number, min: 0, max: 5 },
  source: { type: String, enum: ['algorithm', 'expert', 'community'] }
});

// Compound index to prevent duplicate dupe relationships
dupeSchema.index({ originalProduct: 1, dupeProduct: 1 }, { unique: true });

// Connect to MongoDB with the correct case for the database name
console.log('Connecting to MongoDB...');

// Parse the connection string to get the parts
const connectionUri = process.env.MONGODB_URI;
const parts = connectionUri.split('/');
const dbNameWithParams = parts[parts.length - 1];
const dbNameParts = dbNameWithParams.split('?');
const queryParams = dbNameParts.length > 1 ? '?' + dbNameParts[1] : '';

// Replace the database name with the correct case
const correctedUri = connectionUri.replace(dbNameWithParams, 'Stealthedupe' + queryParams);
console.log('Using connection string with database name: Stealthedupe');

mongoose.connect(correctedUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define Product and Dupe models
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Dupe = mongoose.models.Dupe || mongoose.model('Dupe', dupeSchema);

// Sample high-end products
const highEndProducts = [
  {
    name: 'Pillow Talk Matte Revolution Lipstick',
    brand: 'Charlotte Tilbury',
    category: 'Lipstick',
    description: 'Award-winning, bestselling matte lipstick with a long-lasting, buildable, hydrating formula.',
    ingredients: [
      'Ricinus Communis (Castor) Seed Oil', 
      'Caprylic/Capric Triglyceride', 
      'Trioctyldodecyl Citrate', 
      'Lanolin Oil', 
      'Pentaerythrityl Tetraisostearate', 
      'Octyldodecanol'
    ],
    price: {
      amount: 34.00,
      currency: 'USD',
      lastUpdated: new Date()
    },
    imageUrl: 'https://www.charlottetilbury.com/media/catalog/product/m/a/matte-revolution-pillow-talk-swatch_1.png',
    url: 'https://www.charlottetilbury.com/product/matte-revolution-pillow-talk',
    availabilityStatus: 'In Stock',
    ratingAverage: 4.8,
    ratingCount: 8945
  },
  {
    name: 'Double Wear Stay-in-Place Foundation',
    brand: 'Estée Lauder',
    category: 'Foundation',
    description: '24-hour wear. Flawless, natural, matte foundation.',
    ingredients: [
      'Water', 
      'Cyclopentasiloxane', 
      'Trimethylsiloxysilicate', 
      'Peg/Ppg-18/18 Dimethicone', 
      'Butylene Glycol'
    ],
    price: {
      amount: 48.00,
      currency: 'USD',
      lastUpdated: new Date()
    },
    imageUrl: 'https://www.esteelauder.com/media/export/cms/products/640x640/el_sku_GM6C01_640x640_0.jpg',
    url: 'https://www.esteelauder.com/product/643/22830/product-catalog/makeup/face/foundation/double-wear/stay-in-place-foundation',
    availabilityStatus: 'In Stock',
    ratingAverage: 4.7,
    ratingCount: 14785
  },
  {
    name: 'They\'re Real! Lengthening Mascara',
    brand: 'Benefit Cosmetics',
    category: 'Mascara',
    description: 'Lengthens, curls, volumizes, lifts & separates lashes.',
    ingredients: [
      'Water', 
      'Beeswax', 
      'Paraffin', 
      'Glyceryl Stearate', 
      'Acacia Senegal Gum'
    ],
    price: {
      amount: 27.00,
      currency: 'USD',
      lastUpdated: new Date()
    },
    imageUrl: 'https://www.benefitcosmetics.com/globalassets/product-pages/they-real/2022/theyre-real-magnet/trm_mascara_closed_pack_shot.jpg',
    url: 'https://www.benefitcosmetics.com/en-us/product/theyre-real-lengthening-mascara',
    availabilityStatus: 'In Stock',
    ratingAverage: 4.4,
    ratingCount: 12453
  }
];

// Sample affordable dupe products
const dupeProducts = [
  {
    name: 'Super Stay Matte Ink Liquid Lipstick',
    brand: 'Maybelline',
    category: 'Lipstick',
    description: 'Liquid matte lipstick with up to 16-hour wear.',
    ingredients: [
      'Dimethicone',
      'Trimethylsiloxysilicate',
      'Isododecane',
      'Nylon-611/Dimethicone Copolymer',
      'Silica'
    ],
    price: {
      amount: 9.99,
      currency: 'USD',
      lastUpdated: new Date()
    },
    imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/lip-makeup/lip-color/superstay-matte-ink-liquid-lipstick/maybelline-matte-ink-liquid-lipstick-lover-70-041554515398-o.jpg',
    url: 'https://www.maybelline.com/lip-makeup/lipstick/superstay-matte-ink-liquid-lipstick',
    availabilityStatus: 'In Stock',
    ratingAverage: 4.5,
    ratingCount: 7834
  },
  {
    name: 'Fit Me Matte + Poreless Foundation',
    brand: 'Maybelline',
    category: 'Foundation',
    description: 'For normal to oily skin, blurs pores and absorbs oil.',
    ingredients: [
      'Water',
      'Cyclohexasiloxane',
      'Dimethicone',
      'Isododecane',
      'Alcohol Denat'
    ],
    price: {
      amount: 7.99,
      currency: 'USD',
      lastUpdated: new Date()
    },
    imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/face-makeup/foundation/fit-me-matte-poreless-foundation/maybelline-foundation-fit-me-matte-poreless-classic-ivory-120-041554433685-o.jpg',
    url: 'https://www.maybelline.com/face-makeup/foundation/fit-me-matte-poreless-foundation',
    availabilityStatus: 'In Stock',
    ratingAverage: 4.3,
    ratingCount: 9865
  },
  {
    name: 'Lash Sensational Mascara',
    brand: 'Maybelline',
    category: 'Mascara',
    description: 'Volumizing and lengthening mascara with a fanning brush.',
    ingredients: [
      'Aqua',
      'Paraffin',
      'Potassium Cetyl Phosphate',
      'Acrylates Copolymer',
      'Beeswax'
    ],
    price: {
      amount: 8.99,
      currency: 'USD',
      lastUpdated: new Date()
    },
    imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/eye-makeup/mascara/lash-sensational-washable-mascara/maybelline-lash-sensational-mascara-washable-blackest-black-041554493818-o.jpg',
    url: 'https://www.maybelline.com/eye-makeup/mascara/lash-sensational-washable-mascara',
    availabilityStatus: 'In Stock',
    ratingAverage: 4.4,
    ratingCount: 8753
  },
  {
    name: 'ColorStay Ultimate Liquid Lipstick',
    brand: 'Revlon',
    category: 'Lipstick',
    description: 'Food-proof, transfer-resistant liquid lip color.',
    ingredients: [
      'Isododecane',
      'Dimethicone',
      'Trimethylsiloxysilicate',
      'Polyethylene',
      'Disteardimonium Hectorite'
    ],
    price: {
      amount: 11.99,
      currency: 'USD',
      lastUpdated: new Date()
    },
    imageUrl: 'https://www.revlon.com/media/filer_public/96/69/96693be8-24d9-44e8-af33-39a5e2e14e7a/colorstay-ultimate-liquid-lipstick-1x1.jpg',
    url: 'https://www.revlon.com/lip-makeup/lipstick/colorstay-ultimate-liquid-lipstick',
    availabilityStatus: 'In Stock',
    ratingAverage: 4.1,
    ratingCount: 5432
  }
];

// Dupe relationships between products
const dupeRelationships = [
  {
    // Charlotte Tilbury -> Maybelline
    originalProductIndex: 0,
    dupeProductIndex: 0,
    similarityScore: 85,
    ingredientMatch: 78,
    priceDifference: 24.01,
    communityRating: 4.3,
    source: 'expert'
  },
  {
    // Charlotte Tilbury -> Revlon
    originalProductIndex: 0,
    dupeProductIndex: 3,
    similarityScore: 82,
    ingredientMatch: 75,
    priceDifference: 22.01,
    communityRating: 4.0,
    source: 'expert'
  },
  {
    // Estée Lauder -> Maybelline
    originalProductIndex: 1,
    dupeProductIndex: 1,
    similarityScore: 87,
    ingredientMatch: 80,
    priceDifference: 40.01,
    communityRating: 4.5,
    source: 'expert'
  },
  {
    // Benefit -> Maybelline
    originalProductIndex: 2,
    dupeProductIndex: 2,
    similarityScore: 89,
    ingredientMatch: 82,
    priceDifference: 18.01,
    communityRating: 4.4,
    source: 'expert'
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Dupe.deleteMany({});
    
    console.log('Deleted existing data');
    
    // Insert high-end products
    const highEndDocs = await Product.insertMany(highEndProducts);
    console.log(`Inserted ${highEndDocs.length} high-end products`);
    
    // Insert dupe products
    const dupeDocs = await Product.insertMany(dupeProducts);
    console.log(`Inserted ${dupeDocs.length} dupe products`);
    
    // Create dupe relationships
    const relationships = dupeRelationships.map(rel => ({
      originalProduct: highEndDocs[rel.originalProductIndex]._id,
      dupeProduct: dupeDocs[rel.dupeProductIndex]._id,
      similarityScore: rel.similarityScore,
      ingredientMatch: rel.ingredientMatch,
      priceDifference: rel.priceDifference,
      communityRating: rel.communityRating,
      source: rel.source
    }));
    
    const dupeRelDocs = await Dupe.insertMany(relationships);
    console.log(`Created ${dupeRelDocs.length} dupe relationships`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase(); 