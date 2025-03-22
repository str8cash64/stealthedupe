import mongoose from 'mongoose';
import Product from '../models/Product';
import Dupe from '../models/Dupe';

// Initial sample data - high-end products
const highEndProducts = [
  {
    name: 'Double Wear Stay-in-Place Foundation',
    brand: 'Estée Lauder',
    category: 'foundation',
    description: 'Long-wearing foundation with 24-hour staying power and medium to full coverage.',
    price: {
      amount: 43.00,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.esteelauder.com/media/export/cms/products/640x640/el_sku_YNHC01_640x640_0.jpg',
    ingredients: [
      'Water', 'Cyclopentasiloxane', 'Trimethylsiloxysilicate', 'PEG-10 Dimethicone',
      'Butylene Glycol', 'Dimethicone', 'Glycerin', 'Phenyl Trimethicone', 'Silica',
      'Tocopheryl Acetate', 'Titanium Dioxide', 'Zinc Oxide', 'Polymethylsilsesquioxane'
    ],
    sku: 'YNHC01',
    url: 'https://www.esteelauder.com/product/643/22830/product-catalog/makeup/face/foundation/double-wear/stay-in-place-foundation',
    retailer: 'Estée Lauder',
  },
  {
    name: 'Pillow Talk Matte Revolution Lipstick',
    brand: 'Charlotte Tilbury',
    category: 'lipstick',
    description: 'Nude-pink lipstick with a matte finish for fuller-looking lips.',
    price: {
      amount: 34.00,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.charlottetilbury.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/m/a/matte-revolution-pillow-talk-lipstick-packshot-1_1_1.png',
    ingredients: [
      'Ricinus Communis (Castor) Seed Oil', 'Caprylic/Capric Triglyceride', 'Cera Carnauba/Copernicia Cerifera (Carnauba) Wax/Cire De Carnauba',
      'Silica', 'Ozokerite', 'Olus Oil/Vegetable Oil/Huile Végétale', 'Candelilla Cera/Euphorbia Cerifera (Candelilla) Wax/Cire De Candelilla',
      'Ethylhexyl Palmitate', 'Mica', 'Tin Oxide', 'Titanium Dioxide'
    ],
    sku: 'CT-MATTE-PILLOWTALK',
    url: 'https://www.charlottetilbury.com/en-us/products/matte-revolution-lipstick-pillow-talk',
    retailer: 'Charlotte Tilbury',
  },
  {
    name: 'They\'re Real! Lengthening Mascara',
    brand: 'Benefit Cosmetics',
    category: 'mascara',
    description: 'Lengthens and curls lashes with a specially designed brush.',
    price: {
      amount: 27.00,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.benefitcosmetics.com/globalassets/catalog/product/b/e/benefit-cosmetics-theyre-real-lengthening-mascara.png',
    ingredients: [
      'Water', 'Paraffin', 'Polybutene', 'Styrene/Acrylates/Ammonium Methacrylate Copolymer',
      'Beeswax', 'Glyceryl Stearate', 'Acrylates Copolymer', 'Butylene Glycol',
      'Stearic Acid', 'Palmitic Acid', 'Sorbitan Olivate', 'Panthenol'
    ],
    sku: 'BENF-REAL-MASC',
    url: 'https://www.benefitcosmetics.com/en-us/product/they-re-real-lengthening-mascara',
    retailer: 'Benefit Cosmetics',
  },
];

// Dupe products (affordable alternatives)
const dupeProducts = [
  {
    name: 'Infallible 24H Fresh Wear Foundation',
    brand: 'L\'Oréal Paris',
    category: 'foundation',
    description: 'Lightweight, long-wearing foundation with medium to full coverage.',
    price: {
      amount: 15.99,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.lorealparis.com/-/media/project/loreal/brand-sites/oap/americas/us/products/makeup/face/foundation/infallible-fresh-wear-foundation/oap-face-foundation-loreal-infallible-fresh-wear-satin-foundation-standard-1x1.jpg',
    ingredients: [
      'Water', 'Dimethicone', 'Isododecane', 'PEG-10 Dimethicone', 'Glycerin',
      'Trimethylsiloxysilicate', 'Polybutene', 'Titanium Dioxide', 'Iron Oxides', 'Silica'
    ],
    sku: 'LORINFFW',
    url: 'https://www.lorealparis.com/en-us/infallible-24h-fresh-wear-foundation',
    retailer: 'L\'Oréal Paris',
  },
  {
    name: 'Super Stay Matte Ink Liquid Lipstick',
    brand: 'Maybelline',
    category: 'lipstick',
    description: 'Long-lasting liquid lipstick with matte finish.',
    price: {
      amount: 9.99,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/lip-makeup/lip-color/superstay-matte-ink-liquid-lipstick/maybelline-matte-ink-liquid-lipstick-lover-70-041554515398-o.jpg',
    ingredients: [
      'Isododecane', 'Dimethicone', 'Trimethylsiloxysilicate', 'Polypropylsilsesquioxane',
      'Kaolin', 'Silica Dimethyl Silylate', 'Polybutene', 'Mica', 'Titanium Dioxide',
      'Iron Oxides', 'Red 7'
    ],
    sku: 'MAYBELSS',
    url: 'https://www.maybelline.com/lip-makeup/lipstick/superstay-matte-ink-liquid-lipstick',
    retailer: 'Maybelline',
  },
  {
    name: 'Lash Sensational Mascara',
    brand: 'Maybelline',
    category: 'mascara',
    description: 'Volumizing and lengthening mascara with fanning brush.',
    price: {
      amount: 8.99,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/eye-makeup/mascara/lash-sensational-washable-mascara/lash-sensational-washable-mascara-very-black-041554433982-o.jpg',
    ingredients: [
      'Water', 'Paraffin', 'Cera Alba/Beeswax', 'Propylene Glycol', 'Glyceryl Stearate',
      'Stearic Acid', 'Copernicia Cerifera Cera/Carnauba Wax', 'Butylene Glycol',
      'Acacia Senegal Gum', 'Panthenol', 'Ozokerite'
    ],
    sku: 'MAYBLES',
    url: 'https://www.maybelline.com/eye-makeup/mascara/lash-sensational-mascara/blackest-black',
    retailer: 'Maybelline',
  },
  {
    name: 'Photo Focus Foundation',
    brand: 'Wet n Wild',
    category: 'foundation',
    description: 'Light to medium coverage foundation with matte finish.',
    price: {
      amount: 6.49,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.wetnwildbeauty.com/media/catalog/product/cache/07d295f7f49618a91ac9f7cf8a27a485/n/e/new_pf_foundation_soft_ivory.jpg',
    ingredients: [
      'Water', 'Cyclopentasiloxane', 'Glycerin', 'Dimethicone', 'PEG-10 Dimethicone',
      'Alcohol', 'Nylon-12', 'Tocopheryl Acetate', 'Silica', 'Titanium Dioxide', 'Iron Oxides'
    ],
    sku: 'WETFOCUS',
    url: 'https://www.wetnwildbeauty.com/photo-focus-foundation.html',
    retailer: 'Wet n Wild',
  },
  {
    name: 'SuperStay 24 Color Lipstick',
    brand: 'Maybelline',
    category: 'lipstick',
    description: 'Long-lasting, two-step lipstick with color and balm.',
    price: {
      amount: 10.99,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/lip-makeup/lip-color/superstay-24-2-step-liquid-lipstick/maybelline-liquid-lip-super-stay-24-hr-keep-it-red.jpg',
    ingredients: [
      'Isododecane', 'Trimethylsiloxysilicate', 'Nylon-611/Dimethicone Copolymer', 'Disteardimonium Hectorite',
      'Lauroyl Lysine', 'Alumina', 'Mica', 'Polyethylene', 'Propylene Carbonate', 'Silica',
      'Titanium Dioxide', 'Iron Oxides'
    ],
    sku: 'MAYSM24',
    url: 'https://www.maybelline.com/lip-makeup/lipstick/superstay-24-liquid-lipstick',
    retailer: 'Maybelline',
  },
  {
    name: 'Great Lash Mascara',
    brand: 'Maybelline',
    category: 'mascara',
    description: 'Classic mascara with conditioning formula.',
    price: {
      amount: 5.99,
      currency: 'USD',
      lastUpdated: new Date(),
    },
    imageUrl: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/products/eye-makeup/mascara/great-lash-washable-mascara/maybelline-eye-mascara-great-lash-blackest-black-041554000351-o.jpg',
    ingredients: [
      'Water', 'Beeswax', 'Glyceryl Stearate', 'Lanolin', 'Triethanolamine',
      'Propylene Glycol', 'Stearic Acid', 'Paraffin', 'Palmitic Acid', 'Panthenol'
    ],
    sku: 'MAYGLASH',
    url: 'https://www.maybelline.com/eye-makeup/mascara/great-lash-washable-mascara/very-black',
    retailer: 'Maybelline',
  },
];

// Known dupe relationships
const dupeRelationships = [
  {
    // Estée Lauder Double Wear -> L'Oréal Infallible
    originalProduct: 0, // Index in highEndProducts array
    dupeProduct: 0, // Index in dupeProducts array
    similarityScore: 85,
    ingredientMatch: 82,
    priceDifference: 27.01, // 43.00 - 15.99
    source: 'algorithm',
  },
  {
    // Estée Lauder Double Wear -> Wet n Wild Photo Focus
    originalProduct: 0,
    dupeProduct: 3,
    similarityScore: 75,
    ingredientMatch: 70,
    priceDifference: 36.51, // 43.00 - 6.49
    source: 'algorithm',
  },
  {
    // Charlotte Tilbury Pillow Talk -> Maybelline Super Stay Matte Ink
    originalProduct: 1,
    dupeProduct: 1,
    similarityScore: 78,
    ingredientMatch: 75,
    priceDifference: 24.01, // 34.00 - 9.99
    source: 'algorithm',
  },
  {
    // Charlotte Tilbury Pillow Talk -> Maybelline SuperStay 24
    originalProduct: 1,
    dupeProduct: 4,
    similarityScore: 72,
    ingredientMatch: 68,
    priceDifference: 23.01, // 34.00 - 10.99
    source: 'algorithm',
  },
  {
    // Benefit They're Real -> Maybelline Lash Sensational
    originalProduct: 2,
    dupeProduct: 2,
    similarityScore: 88,
    ingredientMatch: 85,
    priceDifference: 18.01, // 27.00 - 8.99
    source: 'algorithm',
  },
  {
    // Benefit They're Real -> Maybelline Great Lash
    originalProduct: 2,
    dupeProduct: 5,
    similarityScore: 70,
    ingredientMatch: 65,
    priceDifference: 21.01, // 27.00 - 5.99
    source: 'algorithm',
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Product.deleteMany({});
    await Dupe.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert high-end products
    const highEndInserted = await Product.insertMany(highEndProducts);
    console.log(`Inserted ${highEndInserted.length} high-end products`);
    
    // Insert dupe products
    const dupeInserted = await Product.insertMany(dupeProducts);
    console.log(`Inserted ${dupeInserted.length} dupe products`);
    
    // Create dupe relationships
    const dupeRelationshipsToInsert = dupeRelationships.map(rel => ({
      originalProduct: highEndInserted[rel.originalProduct]._id,
      dupeProduct: dupeInserted[rel.dupeProduct]._id,
      similarityScore: rel.similarityScore,
      ingredientMatch: rel.ingredientMatch,
      priceDifference: rel.priceDifference,
      source: rel.source,
    }));
    
    const relInserted = await Dupe.insertMany(dupeRelationshipsToInsert);
    console.log(`Inserted ${relInserted.length} dupe relationships`);
    
    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Unhandled error during seeding:', error);
      process.exit(1);
    });
} 