import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, type } = body;
    
    console.log(`Mock search API called with: ${type} - ${query}`);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock original product for comparison
    const originalProduct = {
      id: "orig123",
      name: "Rouge Dior Lipstick",
      brand: "Dior",
      price: 42.00,
      image: "https://www.sephora.com/productimages/sku/s2393114-main-zoom.jpg?imwidth=612",
      link: "https://www.sephora.com/product/dior-rouge-dior-refillable-lipstick-P467527",
      color: "999 Ultra Dior - classic red",
      colorHex: "#C81D1D",
      ingredients: [
        "Ricinus Communis (Castor) Seed Oil", 
        "Octyldodecanol", 
        "Hydrogenated Polydecene",
        "Bis-Diglyceryl Polyacyladipate-2", 
        "Polybutene", 
        "Pentaerythrityl Tetraisostearate"
      ]
    };
    
    // Mock dupes with color information and match scores
    const dupes = [
      {
        id: "dupe1",
        name: "Color Sensational Lipstick - Red Revival",
        brand: "Maybelline",
        price: 8.99,
        image: "https://www.maybelline.com/~/media/mny/us/lip-makeup/lip-color/color-sensational-lipcolor/maybelline-lip-color-sensational-red-revival-645-041554015423-o.jpg",
        link: "https://www.maybelline.com/lip-makeup/lipstick/color-sensational-lipstick/red-revival",
        color: "Red Revival - medium true red",
        colorHex: "#C12C28",
        ingredients: [
          "Isononyl Isononanoate",
          "Octyldodecanol",
          "Oleyl Erucate",
          "Silica",
          "Cera Microcristallina / Microcrystalline Wax / Cire Microcristalline"
        ],
        similarityScore: 87,
        ingredientMatch: 76,
        colorMatch: 92,
        finishMatch: 85,
        priceDifference: 33.01
      },
      {
        id: "dupe2",
        name: "Super Lustrous Lipstick - Certainly Red",
        brand: "Revlon",
        price: 9.99,
        image: "https://www.revlon.com/~/media/revlon-consumer/products/lips/lipstick/super-lustrous-lipstick/744_certainly_red_open-1.jpg",
        link: "https://www.revlon.com/lips/lipstick/super-lustrous-lipstick?shade=certainly-red",
        color: "Certainly Red - bright blue-red",
        colorHex: "#D42E32",
        ingredients: [
          "Trioctyldodecyl Citrate",
          "Ozokerite",
          "Polybutene",
          "Ethylhexyl Palmitate",
          "Octyldodecanol",
          "Pentaerythrityl Tetraisostearate"
        ],
        similarityScore: 82,
        ingredientMatch: 68,
        colorMatch: 89,
        finishMatch: 80,
        priceDifference: 32.01
      },
      {
        id: "dupe3",
        name: "Velvet Matte Lip Pencil - Cruella",
        brand: "NARS",
        price: 29.00,
        image: "https://www.narscosmetics.com/dw/image/v2/BBSK_PRD/on/demandware.static/-/Sites-itemmaster_NARS/default/dw1a158412/hi-res/NARS_SP23_Lifestyle_VMLP_Cruella_Soldier_Open_Capped_0.jpg",
        link: "https://www.narscosmetics.com/USA/cruella-velvet-matte-lip-pencil/999NACRUELLAV.html",
        color: "Cruella - deep red with blue undertones",
        colorHex: "#B8232F",
        ingredients: [
          "C10-30 Cholesterol/Lanosterol Esters",
          "Phytosteryl Macadamiate",
          "Bis-Diglyceryl Polyacyladipate-2",
          "Polyethylene",
          "Diisostearyl Malate"
        ],
        similarityScore: 78,
        ingredientMatch: 65,
        colorMatch: 86,
        finishMatch: 72,
        priceDifference: 13.00
      }
    ];
    
    // Analysis insights with color matching information
    const analysisInsights = {
      originalProduct: {
        brand: originalProduct.brand,
        name: originalProduct.name,
        price: originalProduct.price,
        color: originalProduct.color
      },
      summary: "Found 3 dupes for Dior Rouge Dior Lipstick in the red family. These alternatives offer similar color payoff and finish at lower price points.",
      colorAnalysis: "The original Dior Ultra Dior is a classic blue-based red. Maybelline's Red Revival provides the closest color match with similar blue undertones and intensity. NARS Cruella is slightly deeper with stronger blue undertones.",
      ingredientAnalysis: "The Maybelline dupe shares 2 key ingredients (Octyldodecanol and Polybutene) with the original. The Revlon dupe contains similar emollients and waxes that provide comparable wear and finish.",
      priceComparison: "The dupes range from $8.99 to $29.00, offering savings of 31-79% compared to the original $42.00 price point."
    };
    
    // Build different responses based on query type
    return NextResponse.json({
      success: true,
      message: "Mock search results found",
      data: {
        originalProduct,
        dupes,
        query,
        queryType: type,
        analysisInsights
      }
    });
    
  } catch (error) {
    console.error('Error in mock search API:', error);
    return NextResponse.json(
      { success: false, message: "Error processing search request" },
      { status: 500 }
    );
  }
} 