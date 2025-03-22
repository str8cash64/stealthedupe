# StealthDupe Backend

This is the backend API for StealthDupe, a beauty product dupe finder application.

## Architecture

The backend is built with:
- Next.js API routes
- MongoDB with Mongoose for data storage
- OpenAI API for ingredient analysis and product matching
- Web scraping utilities for price comparison

## Setup

1. Ensure you have a `.env.local` file in the project root with:

```
# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stealthedupe?retryWrites=true&w=majority

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# App Environment
NODE_ENV=development
```

2. Install dependencies:

```
npm install
```

3. Seed the database with initial product data:

```
npm run seed
```

## API Endpoints

### 1. `/api/search`

Search for product dupes based on a query.

- **Method**: POST
- **Body**:
  ```json
  {
    "query": "Charlotte Tilbury Pillow Talk Lipstick",
    "type": "text" // "text", "url", or "image"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "originalProduct": {
      "id": "...",
      "name": "Pillow Talk Matte Revolution Lipstick",
      "brand": "Charlotte Tilbury",
      "price": "$34.00",
      "imageUrl": "..."
    },
    "dupes": [
      {
        "id": "...",
        "name": "Super Stay Matte Ink Liquid Lipstick",
        "brand": "Maybelline",
        "price": "$9.99",
        "imageUrl": "...",
        "similarityScore": 78,
        "ingredientMatch": 75,
        "priceDifference": 24.01,
        "url": "..."
      },
      // More dupes...
    ],
    "processingTime": 1234
  }
  ```

### 2. `/api/compare-ingredients`

Compare ingredients between two products.

- **Method**: POST
- **Body**:
  ```json
  {
    "originalProductId": "product_id_1",
    "dupeProductId": "product_id_2"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "originalProduct": {
      "id": "...",
      "name": "...",
      "brand": "...",
      "ingredients": ["..."]
    },
    "dupeProduct": {
      "id": "...",
      "name": "...",
      "brand": "...",
      "ingredients": ["..."]
    },
    "comparison": {
      "similarityScore": 78,
      "keyMatches": ["Silica", "Titanium Dioxide"],
      "keyDifferences": ["Beeswax"],
      "overallAnalysis": "...",
      "potentialIssues": "...",
      "priceDifference": 24.01
    },
    "dupeRelationshipId": "..."
  }
  ```

### 3. `/api/prices`

Get price comparisons from different retailers.

- **Method**: GET
- **Query**: `?productId=product_id`
- **Response**:
  ```json
  {
    "success": true,
    "product": {
      "id": "...",
      "name": "...",
      "brand": "..."
    },
    "prices": [
      {
        "retailer": "Sephora",
        "price": "$34.00",
        "currency": "USD",
        "url": "...",
        "inStock": true,
        "lastUpdated": "2023-03-30T12:00:00Z"
      },
      // More prices...
    ],
    "lowestPrice": {
      "retailer": "Amazon",
      "price": "$29.99",
      "currency": "USD",
      "url": "...",
      "inStock": true,
      "lastUpdated": "2023-03-30T12:00:00Z"
    }
  }
  ```

## Database Models

The backend uses these main MongoDB models:

1. **Product**: Beauty products with name, brand, price, ingredients, etc.
2. **Dupe**: Relationships between original products and their dupes
3. **Search**: Log of user searches for analytics

## Development

Run the development server:

```
npm run dev
```

The API will be available at `http://localhost:3000/api/`.

## Testing API Endpoints

You can test the API endpoints using a tool like Postman or curl:

```bash
# Search for dupes
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Charlotte Tilbury Pillow Talk Lipstick", "type": "text"}'

# Compare ingredients
curl -X POST http://localhost:3000/api/compare-ingredients \
  -H "Content-Type: application/json" \
  -d '{"originalProductId": "product_id_1", "dupeProductId": "product_id_2"}'

# Get prices
curl http://localhost:3000/api/prices?productId=product_id
``` 