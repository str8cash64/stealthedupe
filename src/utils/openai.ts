import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes ingredients and compares similarity between two products
 * @param originalIngredients Array of ingredients from the original product
 * @param dupeIngredients Array of ingredients from the potential dupe product
 * @returns Similarity score and analysis
 */
export async function compareIngredients(
  originalIngredients: string[],
  dupeIngredients: string[]
) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a cosmetic ingredient analysis expert. Compare the ingredients 
            of two beauty products and determine their similarity. Focus on active 
            ingredients, formulation, and potential effectiveness. Return a JSON object 
            with a similarity score (0-100) and detailed analysis.`,
        },
        {
          role: 'user',
          content: `
            Original product ingredients: ${originalIngredients.join(', ')}
            
            Potential dupe product ingredients: ${dupeIngredients.join(', ')}
            
            Please analyze the similarity between these two products, focusing on:
            1. Key active ingredients and their concentrations (if discernible)
            2. Base formulation similarity
            3. Potential skin/hair benefits
            4. Any significant differences
            
            Return your analysis as a JSON object with these fields:
            - similarityScore: number between 0-100
            - keyMatches: array of matching key ingredients
            - keyDifferences: array of important ingredients that differ
            - overallAnalysis: string explaining the comparison
            - potentialIssues: any potential concerns (if applicable)
          `,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    // Parse the JSON response
    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      success: true,
      data: analysis,
    };
  } catch (error) {
    console.error('Error comparing ingredients:', error);
    return {
      success: false,
      error: 'Failed to analyze ingredients',
    };
  }
}

/**
 * Extracts product information from text description, URL, or product name
 * @param query The user's product query (text, URL, etc.)
 * @returns Structured product information
 */
export async function extractProductInfo(query: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a beauty product expert. Extract structured information about 
            the beauty product from the user's query. The query may be a product name, 
            description or URL. Return the information as a JSON object.`,
        },
        {
          role: 'user',
          content: `
            Extract detailed information about the beauty product from this query: "${query}"
            
            Return your analysis as a JSON object with these fields when possible:
            - productName: full product name
            - brand: brand name
            - category: product category (e.g., lipstick, foundation, mascara)
            - keyIngredients: array of key ingredients if mentioned
            - priceRange: estimated price range if mentioned
            - isMakeup: boolean indicating if it's makeup
            - isSkincare: boolean indicating if it's skincare
            - isHaircare: boolean indicating if it's haircare
            - confidence: your confidence level in this extraction (0-100)
          `,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    // Parse the JSON response
    const productInfo = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      success: true,
      data: productInfo,
    };
  } catch (error) {
    console.error('Error extracting product info:', error);
    return {
      success: false,
      error: 'Failed to extract product information',
    };
  }
}

export default openai; 