import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Function to scrape product information from search results
async function scrapeProductInfo(query: string) {
  // Mock implementation of web scraping functionality
  console.log('Scraping web for:', query);
  
  // Simulate delay for realistic API behavior
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate random number of products (between 4 and 10)
  const numberOfProducts = Math.floor(Math.random() * 7) + 4;
  const products = [];
  
  // Generate mock product data based on the query
  for (let i = 0; i < numberOfProducts; i++) {
    // Detect category from query
    let category = 'makeup';
    let brands = ['NYX', 'Maybelline', 'L\'Oreal', 'e.l.f.', 'Revlon', 'CoverGirl', 'Physician\'s Formula'];
    let type = 'lipstick';
    
    if (query.toLowerCase().includes('lip')) {
      type = query.toLowerCase().includes('oil') ? 'lip oil' : 
             query.toLowerCase().includes('gloss') ? 'lip gloss' : 
             query.toLowerCase().includes('balm') ? 'lip balm' : 'lipstick';
      brands = ['NYX', 'Maybelline', 'L\'Oreal', 'Revlon', 'Burt\'s Bees', 'Milani', 'Neutrogena'];
    } else if (query.toLowerCase().includes('foundation')) {
      type = 'foundation';
      brands = ['Maybelline', 'L\'Oreal', 'Revlon', 'CoverGirl', 'Milani', 'e.l.f.', 'Neutrogena'];
    } else if (query.toLowerCase().includes('mascara')) {
      type = 'mascara';
      brands = ['Maybelline', 'L\'Oreal', 'CoverGirl', 'Essence', 'Revlon', 'e.l.f.', 'Pacifica'];
    } else if (query.toLowerCase().includes('blush')) {
      type = 'blush';
      brands = ['Milani', 'e.l.f.', 'Maybelline', 'NYX', 'Wet n Wild', 'L\'Oreal', 'CoverGirl'];
    } else if (query.toLowerCase().includes('cream') || query.toLowerCase().includes('moisturizer')) {
      category = 'skincare';
      type = 'moisturizer';
      brands = ['CeraVe', 'Neutrogena', 'Olay', 'La Roche-Posay', 'Cetaphil', 'Aveeno', 'The Ordinary'];
    } else if (query.toLowerCase().includes('serum')) {
      category = 'skincare';
      type = 'serum';
      brands = ['The Ordinary', 'CeraVe', 'Neutrogena', 'La Roche-Posay', 'The Inkey List', 'Good Molecules', 'Versed'];
    }
    
    // Extract brand from query if mentioned
    let originalBrand = '';
    const commonBrands = ['Charlotte Tilbury', 'Dior', 'MAC', 'NARS', 'Fenty', 'Estee Lauder', 'Chanel', 'YSL', 'Tatcha', 'Drunk Elephant'];
    for (const brand of commonBrands) {
      if (query.toLowerCase().includes(brand.toLowerCase())) {
        originalBrand = brand;
        break;
      }
    }
    
    // Generate price (cheaper options for dupes)
    const price = Math.floor(Math.random() * 30) + 5;
    
    // Select a brand different from the original
    let brand = brands[Math.floor(Math.random() * brands.length)];
    
    // Generate a name based on the product type
    const names = {
      'lipstick': ['Color Sensational', 'Super Stay Matte Ink', 'Ultra HD Matte', 'Colorstay', 'Butter Lipstick'],
      'lip oil': ['Hydrating Lip Oil', 'Nourishing Lip Oil', 'Glow Lip Oil', 'Shine Lip Oil', 'Comfort Oil'],
      'lip gloss': ['Butter Gloss', 'Lifter Gloss', 'Shine Loud', 'Filler Instinct', 'Juicy Gloss'],
      'lip balm': ['Baby Lips', 'Hydrating Balm', 'Nourishing Lip Balm', 'Moisture Rescue', 'Lip Therapy'],
      'foundation': ['Fit Me', 'True Match', 'Infallible', 'Stay Matte', 'Photo Focus', 'Born This Way Dupe'],
      'mascara': ['Lash Sensational', 'Voluminous', 'Sky High', 'Lash Blast', 'Big Look'],
      'blush': ['Cheek Tint', 'Fit Me Blush', 'Powder Blush', 'Baked Blush', 'Color Icon'],
      'moisturizer': ['Daily Moisturizing Lotion', 'Hydro Boost', 'Moisturizing Cream', 'Hydrating Gel Cream', 'Ultra Repair Cream'],
      'serum': ['Hyaluronic Acid Serum', 'Niacinamide Serum', 'Vitamin C Serum', 'Retinol Serum', 'Peptide Serum']
    };
    
    const name = names[type as keyof typeof names][Math.floor(Math.random() * names[type as keyof typeof names].length)];
    
    // Generate variety of shades for color products
    let color = '';
    let colorHex = '';
    
    if (['lipstick', 'lip gloss', 'lip oil', 'blush'].includes(type)) {
      const colors = [
        { name: 'Ruby Red', hex: '#E0115F' },
        { name: 'Coral Crush', hex: '#FF7F50' },
        { name: 'Pink Perfection', hex: '#FADADD' },
        { name: 'Mauve Magic', hex: '#CC8899' },
        { name: 'Nude Nectar', hex: '#E6BE8A' },
        { name: 'Dusty Rose', hex: '#C08081' },
        { name: 'Berry Blast', hex: '#8E4585' },
        { name: 'Plum Perfect', hex: '#673147' }
      ];
      
      const selectedColor = colors[Math.floor(Math.random() * colors.length)];
      color = selectedColor.name;
      colorHex = selectedColor.hex;
    }
    
    // Generate realistic ingredients
    const commonIngredients = [
      'Hydrogenated Polyisobutene',
      'Octyldodecanol',
      'Dimethicone',
      'Isododecane',
      'Cera Microcristallina',
      'Silica',
      'Phenoxyethanol',
      'Tocopherol',
      'Parfum',
      'CI 45410',
      'CI 15850',
      'CI 77891',
      'Glycerin',
      'Aqua',
      'Ricinus Communis Seed Oil'
    ];
    
    // Select 5-8 random ingredients
    const numIngredients = Math.floor(Math.random() * 4) + 5;
    const ingredients: string[] = [];
    for (let j = 0; j < numIngredients; j++) {
      const ing = commonIngredients[Math.floor(Math.random() * commonIngredients.length)];
      if (!ingredients.includes(ing)) {
        ingredients.push(ing);
      }
    }
    
    // Generate similarity scores that are realistic
    const similarityScore = Math.floor(Math.random() * 15) + 75; // 75-90% similarity
    const ingredientMatch = Math.floor(Math.random() * 20) + 65; // 65-85% ingredient match
    const colorMatch = color ? Math.floor(Math.random() * 15) + 80 : 0; // 80-95% color match if color product
    const finishMatch = color ? Math.floor(Math.random() * 20) + 75 : 0; // 75-95% finish match if color product
    
    // Generate image URLs that point to safe demo images
    const imageIndex = Math.floor(Math.random() * 10) + 1;
    let image;
    
    // Use a selection of working Unsplash image URLs
    const imageUrls = [
      'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=300&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526758097130-bab247274f58?q=80&w=300&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=300&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=300&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=300&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=300&h=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=300&h=300&auto=format&fit=crop'
    ];
    
    image = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    
    products.push({
      id: `web-${i + 1}`,
      name: `${name} ${color ? '- ' + color : ''}`,
      brand,
      price,
      image,
      link: `https://example.com/product/${i + 1}`,
      color: color || undefined,
      colorHex: colorHex || undefined,
      ingredients,
      similarityScore,
      ingredientMatch,
      colorMatch: color ? colorMatch : undefined,
      finishMatch: color ? finishMatch : undefined,
      source: 'web-search',
      redditReviews: Math.random() > 0.7 ? [
        { text: `I switched from ${originalBrand || 'the expensive one'} to this and saved so much money!`, rating: 5, date: '2 months ago' },
        { text: `It's really close to the original but less than half the price.`, rating: 4, date: '5 months ago' }
      ] : undefined,
      expertReviews: Math.random() > 0.6 ? {
        source: 'Beauty Blog Review',
        rating: Math.floor(Math.random() * 15) + 85, // 85-100 rating
        quote: `This ${brand} product is a fantastic affordable alternative to higher-end options.`
      } : undefined
    });
  }
  
  return {
    query,
    products,
    sources: [
      'Reddit r/MakeupAddiction',
      'Beauty blogs',
      'Product comparison sites',
      'Social media reviews'
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Get product data from web scraping
    const webData = await scrapeProductInfo(query);
    
    return NextResponse.json({
      success: true,
      data: webData
    });
  } catch (error) {
    console.error('Error in web search API:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing web search request' },
      { status: 500 }
    );
  }
} 