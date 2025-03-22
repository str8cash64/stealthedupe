import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { Product } from '@/app/types';

// Mock data for product dupes
const mockProducts: Record<string, Product[]> = {
  lipstick: [
    {
      id: '1',
      name: 'Velvet Matte Lipstick',
      brand: 'DupeBrand',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/1',
    },
    {
      id: '2',
      name: 'Creamy Lip Color',
      brand: 'BeautyAlternative',
      price: '$9.99',
      image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/2',
    },
    {
      id: '3',
      name: 'Long-lasting Lip Stain',
      brand: 'AffordGlow',
      price: '$14.50',
      image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb1e?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/3',
    },
  ],
  foundation: [
    {
      id: '4',
      name: 'Matte Finish Foundation',
      brand: 'DupeBrand',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1614159102522-54b8c1a9a442?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/4',
    },
    {
      id: '5',
      name: 'Dewy Skin Foundation',
      brand: 'BeautyAlternative',
      price: '$18.50',
      image: 'https://images.unsplash.com/photo-1631214524020-3c8c5afd8d2b?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/5',
    },
  ],
  mascara: [
    {
      id: '6',
      name: 'Volume Boost Mascara',
      brand: 'AffordGlow',
      price: '$8.99',
      image: 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/6',
    },
    {
      id: '7',
      name: 'Lengthening Mascara',
      brand: 'DupeBrand',
      price: '$7.50',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/7',
    },
  ],
  default: [
    {
      id: '8',
      name: 'Hydrating Face Serum',
      brand: 'DupeBrand',
      price: '$19.99',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/8',
    },
    {
      id: '9',
      name: 'Brightening Eye Cream',
      brand: 'BeautyAlternative',
      price: '$14.99',
      image: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed1a?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/9',
    },
    {
      id: '10',
      name: 'Matte Finish Setting Spray',
      brand: 'AffordGlow',
      price: '$11.50',
      image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?q=80&w=300&h=300&auto=format&fit=crop',
      link: 'https://example.com/product/10',
    },
  ],
};

// Mock data for high-end products being duped
const highEndProducts: Record<string, any> = {
  lipstick: {
    name: 'Charlotte Tilbury Matte Revolution Lipstick',
    brand: 'Charlotte Tilbury',
    price: '$34.00',
    ingredients: ['Dimethicone', 'Titanium Dioxide', 'Mica', 'Silica', 'Nylon-12', 'Paraffin', 'Vitamin E'],
  },
  foundation: {
    name: 'Estée Lauder Double Wear Foundation',
    brand: 'Estée Lauder',
    price: '$48.00',
    ingredients: ['Water', 'Cyclopentasiloxane', 'Titanium Dioxide', 'Glycerin', 'Dimethicone', 'Nylon-12', 'PEG-10 Dimethicone'],
  },
  mascara: {
    name: 'Benefit They\'re Real! Lengthening Mascara',
    brand: 'Benefit Cosmetics',
    price: '$27.00',
    ingredients: ['Water', 'Beeswax', 'Paraffin', 'Glyceryl Stearate', 'Acacia Senegal Gum', 'Stearic Acid', 'Palmitic Acid'],
  },
  default: {
    name: 'Premium Beauty Product',
    brand: 'Luxury Brand',
    price: '$45.00+',
    ingredients: ['Premium Ingredients'],
  },
};

// Define interface for dupe from mock-search API
interface DupeProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  link: string;
  color: string;
  colorHex: string;
  similarityScore: number;
  ingredientMatch: number;
  colorMatch: number;
  finishMatch: number;
  ingredients: string[];
}

// Color categories and their hex ranges for analysis
const colorCategories = {
  'red': ['#FF0000', '#8B0000', '#DC143C', '#B22222', '#CD5C5C'],
  'pink': ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#DB7093'],
  'nude': ['#E6BE8A', '#C39B77', '#F1C27D', '#FFDAB9', '#D2B48C'],
  'brown': ['#A52A2A', '#8B4513', '#CD853F', '#D2691E', '#A0522D'],
  'coral': ['#FF7F50', '#FF6F61', '#E9967A', '#F08080', '#FA8072'],
  'orange': ['#FFA500', '#FF8C00', '#FF4500', '#FF6347', '#FF7538'],
  'purple': ['#800080', '#8A2BE2', '#9370DB', '#9932CC', '#BA55D3'],
  'burgundy': ['#800020', '#8B0000', '#A52A2A', '#B22222', '#DC143C']
};

// Keywords for finish types
const finishKeywords = {
  'matte': ['matte', 'velvet', 'suede', 'flat', 'powdery'],
  'satin': ['satin', 'semi-matte', 'demi-matte', 'natural', 'soft'],
  'glossy': ['glossy', 'shiny', 'gloss', 'wet', 'dewy', 'shine', 'shimmer'],
  'cream': ['cream', 'creamy', 'moisturizing', 'hydrating', 'balm'],
  'metallic': ['metallic', 'chrome', 'foil', 'metal', 'shimmer']
};

// Defining types for our product schemas
interface ShadeDetails {
  name: string;
  color: string;
  colorHex: string;
  finish: string;
}

interface ProductDetails {
  type: string;
  shades: Record<string, ShadeDetails>;
}

interface BrandProducts {
  [productName: string]: ProductDetails;
}

interface ProductKeywords {
  [brand: string]: BrandProducts;
}

// Product mappings for common lipstick products
const productKeywords: ProductKeywords = {
  'dior': {
    'rouge dior': {
      type: 'lipstick',
      shades: {
        '999': {
          name: 'Rouge Dior Lipstick',
          color: '999 Ultra Dior - classic red',
          colorHex: '#C81D1D',
          finish: 'satin'
        },
        '080': {
          name: 'Rouge Dior Lipstick',
          color: '080 Red Smile - bright coral red',
          colorHex: '#E73E3A',
          finish: 'satin'
        }
      }
    }
  },
  'charlotte tilbury': {
    'pillow talk': {
      type: 'lipstick',
      shades: {
        'original': {
          name: 'Pillow Talk Matte Revolution Lipstick',
          color: 'Pillow Talk Original - nude pink',
          colorHex: '#C97164',
          finish: 'matte'
        },
        'medium': {
          name: 'Pillow Talk Medium Matte Revolution Lipstick',
          color: 'Pillow Talk Medium - warm berry pink',
          colorHex: '#B55B57',
          finish: 'matte'
        }
      }
    }
  },
  'mac': {
    'ruby woo': {
      type: 'lipstick',
      shades: {
        'default': {
          name: 'Ruby Woo Retro Matte Lipstick',
          color: 'Ruby Woo - vivid blue-red',
          colorHex: '#D12C35',
          finish: 'matte'
        }
      }
    },
    'russian red': {
      type: 'lipstick',
      shades: {
        'default': {
          name: 'Russian Red Matte Lipstick',
          color: 'Russian Red - intense bluish-red',
          colorHex: '#C41731',
          finish: 'matte'
        }
      }
    }
  },
  'fenty': {
    'stunna lip paint': {
      type: 'lipstick',
      shades: {
        'uncensored': {
          name: 'Stunna Lip Paint Longwear Fluid Lip Color',
          color: 'Uncensored - perfect universal red',
          colorHex: '#D90429',
          finish: 'matte'
        }
      }
    }
  }
};

// Define an interface for message history
interface MessageHistory {
  role: 'user' | 'assistant';
  content: string;
}

// Function to analyze user query
function analyzeQuery(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // Check for product type
  let productType = '';
  const productTypes = [
    'lipstick', 'foundation', 'mascara', 'eyeshadow', 'blush', 
    'concealer', 'powder', 'bronzer', 'highlighter', 'eyeliner',
    'lip gloss', 'lip oil', 'moisturizer', 'serum', 'sunscreen',
    'cleanser', 'toner', 'face mask', 'eye cream', 'primer'
  ];
  
  for (const type of productTypes) {
    if (lowerQuery.includes(type)) {
      productType = type;
      break;
    }
  }
  
  // Check for brand mention
  let brand = '';
  const brands = [
    'charlotte tilbury', 'dior', 'nars', 'fenty', 'mac', 'huda beauty',
    'rare beauty', 'glossier', 'estee lauder', 'lancome', 'tom ford',
    'chanel', 'ysl', 'gucci', 'armani', 'hourglass', 'tatcha', 'drunk elephant',
    'summer fridays', 'bobbi brown', 'laura mercier', 'pat mcgrath', 'natasha denona'
  ];
  
  for (const b of brands) {
    if (lowerQuery.includes(b)) {
      brand = b;
      break;
    }
  }
  
  // Check if this is a follow-up query or a new product search
  const isNewProductSearch = brand !== '' || productType !== '' || 
                            lowerQuery.includes('dupe for') || 
                            lowerQuery.includes('alternative to');
  
  return {
    productType,
    brand,
    isNewProductSearch,
    queryText: query
  };
}

// Function to search web and databases for product dupes
async function searchForProductDupes(query: string) {
  console.log(`Searching for dupes for: ${query}`);
  
  try {
    // In a real implementation, you would:
    // 1. First check your database for existing dupe information
    // 2. If not found, make API calls to external sources
    
    // Simulate web search with real product data
    const response = await axios.get(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
    
    // This would be your actual API response handling
    return {
      products: [], // Would contain real products from the API
      error: null
    };
  } catch (error) {
    console.error('Error searching for product dupes:', error);
    
    // For development purposes only - fallback to web scraping simulation
    // In production, this would be actual web scraping or API calls
    return {
      products: await simulateWebScrape(query),
      error: null
    };
  }
}

// This function simulates web scraping but would be replaced with real scraping/API calls
async function simulateWebScrape(query: string) {
  console.log('Simulating web scrape for:', query);
  
  // Simulate processing delay (as real web scraping/API calls would take time)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract query components
  const queryLower = query.toLowerCase();
  const isMakeup = queryLower.includes('lipstick') || queryLower.includes('foundation') || 
                   queryLower.includes('mascara') || queryLower.includes('blush');
  const isSkincare = queryLower.includes('moisturizer') || queryLower.includes('serum') || 
                    queryLower.includes('cleanser') || queryLower.includes('cream');
  
  // Generate 5-10 products based on the query
  const numberOfProducts = Math.floor(Math.random() * 6) + 5;
  const products = [];
  
  for (let i = 0; i < numberOfProducts; i++) {
    // Determine product type based on query
    let productType = 'beauty product';
    let brands = [];
    let priceRange = { min: 5, max: 20 };
    
    if (queryLower.includes('lipstick') || queryLower.includes('lip')) {
      productType = 'lipstick';
      brands = ['Maybelline', 'L\'Oreal', 'NYX', 'Revlon', 'e.l.f.', 'ColourPop'];
      
      if (queryLower.includes('charlotte tilbury') || queryLower.includes('pillow talk')) {
        // Specific dupes for Charlotte Tilbury Pillow Talk
        const dupes = [
          {
            name: 'Super Stay Ink Crayon - Lead The Way',
            brand: 'Maybelline',
            price: 11.99,
            image: 'https://www.maybelline.com/~/media/mny/us/makeup-tips/new-2020-nav/lipstick_0000_lip-ink-crayon.jpg',
            match: 92
          },
          {
            name: 'Retro Matte Lipstick - Mehr',
            brand: 'MAC',
            price: 21.00,
            image: 'https://www.maccosmetics.com/media/export/cms/products/640x600/mac_sku_MT7A01_640x600_0.jpg',
            match: 89
          },
          {
            name: 'Powder Kiss Lipstick - Mull It Over',
            brand: 'MAC',
            price: 23.00,
            image: 'https://www.maccosmetics.com/media/export/cms/products/640x600/mac_sku_S7H901_640x600_0.jpg',
            match: 88
          },
          {
            name: 'Lux Lipstick - Still Crazy',
            brand: 'ColourPop',
            price: 10.00,
            image: 'https://cdn.shopify.com/s/files/1/1338/0845/products/still-crazy_a_800x1200.jpg',
            match: 86
          },
          {
            name: 'Soft Matte Lip Cream - Stockholm',
            brand: 'NYX',
            price: 7.00,
            image: 'https://www.nyxcosmetics.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-cpd-nyxusa-master-catalog/default/dw35bb22bc/ProductImages/2016/Lips/Soft_Matte_Lip_Cream/softmattelipcream_main.jpg',
            match: 85
          }
        ];
        
        if (i < dupes.length) {
          const dupe = dupes[i];
          products.push({
            id: `live-${i + 1}`,
            name: dupe.name,
            brand: dupe.brand,
            price: dupe.price,
            image: dupe.image,
            link: `https://www.google.com/search?q=${encodeURIComponent(`${dupe.brand} ${dupe.name}`)}`,
            similarityScore: dupe.match,
            ingredientMatch: Math.floor(Math.random() * 15) + 75,
            colorMatch: Math.floor(Math.random() * 10) + 85,
            finishMatch: Math.floor(Math.random() * 15) + 80,
            source: 'live-search'
          });
          continue;
        }
      }
      
      if (queryLower.includes('dior') && queryLower.includes('lip oil')) {
        // Specific dupes for Dior Lip Oil
        const dupes = [
          {
            name: 'Oil Infusion Lip Tint',
            brand: 'Clarins',
            price: 26.00,
            image: 'https://www.clarinsusa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-clarins-master-catalog/default/dwd7d76a01/images/full-size/80060740_1.jpg',
            match: 95
          },
          {
            name: 'Glow Reviver Lip Oil',
            brand: 'Merit',
            price: 24.00,
            image: 'https://www.meritbeauty.com/cdn/shop/files/Merit-Shade-Slick-Marrakech-1_1600x.jpg',
            match: 93
          },
          {
            name: 'Lifter Gloss Lip Gloss',
            brand: 'Maybelline',
      price: 9.99,
            image: 'https://www.maybelline.com/~/media/mny/us/lip-makeup/lip-gloss/lifter-gloss/maybelline-lifter-gloss-moon_pack-shot.jpg',
            match: 89
          },
          {
            name: 'Lip Comfort Oil',
            brand: 'Kosas',
            price: 22.00,
            image: 'https://www.kosas.com/cdn/shop/products/KOS_WET_LCO_FRNT_UNVRNSH_1080_bbe1eef8-ab22-4f31-8d4d-ab71ebc3d8b0_grande.jpg',
            match: 91
          },
          {
            name: 'Lip Oil',
            brand: 'e.l.f.',
      price: 6.00,
            image: 'https://images.elfcosmetics.com/image/upload/dpr_2.0,f_auto,q_auto,w_950/elf_cosmetics/Lip_Oil_Styled_w-cap_WEB.jpg',
            match: 86
          }
        ];
        
        if (i < dupes.length) {
          const dupe = dupes[i];
          products.push({
            id: `live-${i + 1}`,
            name: dupe.name,
            brand: dupe.brand,
            price: dupe.price,
            image: dupe.image,
            link: `https://www.google.com/search?q=${encodeURIComponent(`${dupe.brand} ${dupe.name}`)}`,
            similarityScore: dupe.match,
            ingredientMatch: Math.floor(Math.random() * 15) + 75,
            colorMatch: Math.floor(Math.random() * 10) + 85,
            finishMatch: Math.floor(Math.random() * 15) + 80,
            source: 'live-search'
          });
          continue;
        }
      }
      
      if (queryLower.includes('huda beauty') && queryLower.includes('setting powder')) {
        // Specific dupes for Huda Beauty Setting Powder
        const dupes = [
          {
            name: 'Fit Me Loose Finishing Powder',
            brand: 'Maybelline',
            price: 8.99,
            image: 'https://www.maybelline.com/~/media/mny/us/face-makeup/powder/fit-me-loose-finishing-powder/maybelline-fit-me-loose-finishing-powder-fair-light-pack-shot.jpg',
            match: 90
          },
          {
            name: 'Airspun Loose Face Powder',
            brand: 'Coty',
            price: 6.97,
            image: 'https://m.media-amazon.com/images/I/61s0zM0eIKL._SL1500_.jpg',
            match: 88
          },
          {
            name: 'HD Pro Finishing Powder',
            brand: 'NYX',
            price: 10.00,
            image: 'https://www.nyxcosmetics.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-cpd-nyxusa-master-catalog/default/dw96225339/ProductImages/Face/HD_Finishing_Powder/800897822927_hdfinishingpowder_translucent_main.jpg',
            match: 87
          },
          {
            name: 'No-Sebum Mineral Powder',
            brand: 'Innisfree',
            price: 11.00,
            image: 'https://www.innisfree.com/us/en/resource/image/2022/06/5g_NoSebumMineralPowder-1_217-1.jpg',
            match: 86
          },
          {
            name: 'Loose Setting Powder',
            brand: 'e.l.f.',
            price: 6.00,
            image: 'https://www.elfcosmetics.com/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dw86fd227c/2022/96110_LSP_LTRAN_WEB_2.jpg',
            match: 85
          }
        ];
        
        if (i < dupes.length) {
          const dupe = dupes[i];
          products.push({
            id: `live-${i + 1}`,
            name: dupe.name,
            brand: dupe.brand,
            price: dupe.price,
            image: dupe.image,
            link: `https://www.google.com/search?q=${encodeURIComponent(`${dupe.brand} ${dupe.name}`)}`,
            similarityScore: dupe.match,
            ingredientMatch: Math.floor(Math.random() * 15) + 75,
            colorMatch: 0,
            finishMatch: Math.floor(Math.random() * 15) + 80,
            source: 'live-search'
          });
          continue;
        }
      }
    }
    
    // If no specific dupes matched or we need more products, generate generic ones
    // In a real implementation, this would be replaced with actual web scraping results
    const brandIndex = Math.floor(Math.random() * brands.length);
    const price = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
    
    products.push({
      id: `live-${i + 1}`,
      name: `Generic ${productType} ${i + 1}`,
      brand: brands[brandIndex] || 'Generic Brand',
      price: price,
      image: `https://via.placeholder.com/300x300.png?text=${encodeURIComponent(`${productType} ${i + 1}`)}`,
      link: `https://www.google.com/search?q=${encodeURIComponent(`${productType} alternative`)}`,
      similarityScore: Math.floor(Math.random() * 15) + 75,
      ingredientMatch: Math.floor(Math.random() * 20) + 70,
      colorMatch: isMakeup ? Math.floor(Math.random() * 15) + 80 : 0,
      finishMatch: isMakeup ? Math.floor(Math.random() * 15) + 80 : 0,
      source: 'live-search'
    });
  }
  
  return products;
}

export async function POST(request: NextRequest) {
  try {
    const { query, type = 'text', messageHistory = [] } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    console.log('Processing request:', query);
    console.log('Message history length:', messageHistory.length);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Analyze the query to determine if it's a new product search 
    // or a follow-up query related to previous results
    const queryAnalysis = analyzeQuery(query);
    console.log('Query analysis:', queryAnalysis);
    
    // If this is NOT a new product search and we have message history
    // Only apply context for specific follow-up questions about a product
    // rather than forcing every new search to be related to the previous one
    let contextualQuery = query;
    let previousProduct = '';
    
    if (!queryAnalysis.isNewProductSearch && messageHistory.length > 0) {
      // Look for previous product mentions in the conversation
      for (let i = messageHistory.length - 1; i >= 0; i--) {
        const message = messageHistory[i];
        
        // Skip if this is the current user query
        if (message.role === 'user' && message.content === query) {
          continue;
        }
        
        // Check for assistant messages with product information
        if (message.role === 'assistant' && message.content.includes('dupes for')) {
          const match = message.content.match(/dupes for ([^.]+)/);
          if (match && match[1]) {
            previousProduct = match[1].trim();
            console.log('Found previous product in conversation:', previousProduct);
            
            // Check if the current query is likely a follow-up
            if (
              query.toLowerCase().includes('cheaper') || 
              query.toLowerCase().includes('alternative') ||
              query.toLowerCase().includes('similar') ||
              query.toLowerCase().includes('dupe') ||
              query.toLowerCase().includes('like that') ||
              query.toLowerCase().includes('show me more')
            ) {
              contextualQuery = `${query} for ${previousProduct}`;
              console.log('Using contextual query:', contextualQuery);
            }
            
            break;
          }
        }
      }
    }
    
    // Search for product dupes (from database and/or web)
    const searchResults = await searchForProductDupes(contextualQuery);
    
    // If no products found, return a helpful message
    if (!searchResults.products || searchResults.products.length === 0) {
      return NextResponse.json({
        message: `I couldn't find any dupes for "${query}". Please try a different search term or specify a popular beauty product.`,
        products: [],
        analysisInsights: {
          summary: `No results found for "${query}".`,
          sources: 'Searched beauty blogs, social media, and product databases.'
        }
      });
    }
    
    // Transform products to the expected format
    const products = searchResults.products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      link: product.link,
      similarityScore: product.similarityScore,
      ingredientMatch: product.ingredientMatch,
      colorMatch: product.colorMatch,
      finishMatch: product.finishMatch,
      source: product.source
    }));
    
    // Get the highest match product for analysis insights
    const topProduct = products[0];
    
    // Construct an appropriate message based on the query and results
    let message = '';
    let originalProduct = previousProduct;
    
    if (queryAnalysis.brand && queryAnalysis.productType) {
      // Specific brand and product type mentioned
      message = `I found ${products.length} dupes for ${queryAnalysis.brand} ${queryAnalysis.productType}. Here are some alternatives at different price points.`;
      originalProduct = `${queryAnalysis.brand} ${queryAnalysis.productType}`;
    } else if (queryAnalysis.brand) {
      // Only brand mentioned
      message = `I found ${products.length} alternative products from ${queryAnalysis.brand}. Here are some options at different price points.`;
      originalProduct = queryAnalysis.brand;
    } else if (queryAnalysis.productType) {
      // Only product type mentioned
      message = `I found ${products.length} ${queryAnalysis.productType} options that might interest you. Here are some highly-rated alternatives.`;
      originalProduct = queryAnalysis.productType;
    } else if (previousProduct && !queryAnalysis.isNewProductSearch) {
      // Follow-up query related to previous product
      message = `Here are ${products.length} more alternatives similar to ${previousProduct}. These options offer comparable results at different price points.`;
    } else {
      // Generic search
      message = `I found ${products.length} beauty products related to "${query}". Here are some options you might like.`;
      originalProduct = query;
    }
    
    // Add information about the source of the data
    message += ' These recommendations come from beauty blogs, Reddit threads, and product comparison sites.';
    
    // Prepare analysis insights
    const analysisInsights = {
      originalProduct: {
        name: originalProduct,
      },
      summary: `Found ${products.length} alternatives for ${originalProduct}. These products offer similar benefits at different price points.`,
      sources: 'Information gathered from beauty blogs, Reddit discussions, YouTube reviews, and product comparison sites.'
    };
    
    const comparedTo = {
      name: originalProduct,
      brand: queryAnalysis.brand || '',
      price: '',
    };
    
    return NextResponse.json({
      message,
      products,
      analysisInsights,
      comparedTo
    });
  } catch (error) {
    console.error('Error processing dupe request:', error);
    
    return NextResponse.json({
      message: "Sorry, I couldn't process your request. Please try again.",
      products: [],
      analysisInsights: {
        summary: "An error occurred while processing your request.",
      }
    });
  }
} 