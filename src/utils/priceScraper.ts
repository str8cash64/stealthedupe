import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedPrice {
  price: number | null;
  currency: string;
  url: string;
  inStock: boolean;
  retailer: string;
  lastUpdated: Date;
}

interface ScraperResult {
  success: boolean;
  data?: ScrapedPrice;
  error?: string;
}

/**
 * Generic function to fetch HTML content
 */
async function fetchHtml(url: string): Promise<string> {
  try {
    // Set a user agent to avoid being blocked
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000, // 10 seconds timeout
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching HTML from ${url}:`, error);
    throw new Error(`Failed to fetch HTML from ${url}`);
  }
}

/**
 * Scrape price from Sephora product page
 */
export async function scrapeSephoraPrice(url: string): Promise<ScraperResult> {
  try {
    // This is a mock implementation - in production you would implement actual scraping
    // For demonstration purposes only
    
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    
    // These selectors would need to be adjusted based on Sephora's actual HTML structure
    const priceText = $('.price-tag').text().trim();
    const inStockText = $('.availability').text().trim();
    
    // Extract price using regex (this is simplified)
    const priceMatch = priceText.match(/\$(\d+\.\d+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : null;
    
    return {
      success: true,
      data: {
        price,
        currency: 'USD',
        url,
        inStock: inStockText.toLowerCase().includes('in stock'),
        retailer: 'Sephora',
        lastUpdated: new Date(),
      },
    };
  } catch (error) {
    console.error('Error scraping Sephora price:', error);
    return {
      success: false,
      error: 'Failed to scrape Sephora price',
    };
  }
}

/**
 * Scrape price from Ulta product page
 */
export async function scrapeUltaPrice(url: string): Promise<ScraperResult> {
  try {
    // Mock implementation
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    
    // These selectors would need to be adjusted based on Ulta's actual HTML structure
    const priceText = $('.product-price').text().trim();
    const inStockText = $('.availability').text().trim();
    
    // Extract price using regex (this is simplified)
    const priceMatch = priceText.match(/\$(\d+\.\d+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : null;
    
    return {
      success: true,
      data: {
        price,
        currency: 'USD',
        url,
        inStock: inStockText.toLowerCase().includes('in stock'),
        retailer: 'Ulta',
        lastUpdated: new Date(),
      },
    };
  } catch (error) {
    console.error('Error scraping Ulta price:', error);
    return {
      success: false,
      error: 'Failed to scrape Ulta price',
    };
  }
}

/**
 * Get price from multiple retailers
 */
export async function getPriceFromMultipleRetailers(
  productName: string,
  brand: string
): Promise<{
  success: boolean;
  data?: ScrapedPrice[];
  error?: string;
}> {
  try {
    // In a real implementation, you would:
    // 1. Search for the product on multiple retailers
    // 2. Scrape the first few results
    // 3. Return the best matches
    
    // For demo purposes, we'll return mock data
    const mockPrices: ScrapedPrice[] = [
      {
        price: 34.99,
        currency: 'USD',
        url: 'https://www.sephora.com/product/example',
        inStock: true,
        retailer: 'Sephora',
        lastUpdated: new Date(),
      },
      {
        price: 32.99,
        currency: 'USD',
        url: 'https://www.ulta.com/product/example',
        inStock: true,
        retailer: 'Ulta',
        lastUpdated: new Date(),
      },
      {
        price: 29.99,
        currency: 'USD',
        url: 'https://www.amazon.com/product/example',
        inStock: true,
        retailer: 'Amazon',
        lastUpdated: new Date(),
      },
    ];
    
    return {
      success: true,
      data: mockPrices,
    };
  } catch (error) {
    console.error('Error getting prices from multiple retailers:', error);
    return {
      success: false,
      error: 'Failed to get prices from retailers',
    };
  }
}

/**
 * Extract ingredients from product page
 */
export async function extractIngredientsFromUrl(url: string): Promise<{
  success: boolean;
  ingredients?: string[];
  error?: string;
}> {
  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    
    // This selector would need to be adjusted based on the retailer's actual HTML structure
    // Most sites have ingredients in a specific section or tab
    let ingredientsText = $('.ingredients-list').text().trim();
    
    // If not found, try alternative selectors that are common across beauty sites
    if (!ingredientsText) {
      ingredientsText = $('#ingredients').text().trim();
    }
    
    if (!ingredientsText) {
      ingredientsText = $('[data-ingredients]').text().trim();
    }
    
    // If still not found, return failure
    if (!ingredientsText) {
      return {
        success: false,
        error: 'Ingredients not found on page',
      };
    }
    
    // Process the ingredients text
    // Typically, ingredients are comma-separated
    const ingredients = ingredientsText
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);
    
    return {
      success: true,
      ingredients,
    };
  } catch (error) {
    console.error('Error extracting ingredients:', error);
    return {
      success: false,
      error: 'Failed to extract ingredients',
    };
  }
} 