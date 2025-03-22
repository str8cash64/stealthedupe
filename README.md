# StealthDupe

StealthDupe is a web application that helps users find affordable alternatives (dupes) to popular beauty products. Users can input a beauty product link, upload an image, or describe a product, and the AI will return dupe recommendations based on price and similarity.

## Features

- Clean, responsive chat UI
- Three input options: paste a link, upload an image, or text input
- AI processes input and returns alternative (dupe) recommendations
- Display results in a card format with product image, name, and price
- Typing animation effect for AI responses

## Tech Stack

- **Frontend**: Next.js (with App Router), TailwindCSS, React
- **Backend**: API routes in Next.js (temporary mock API)
- **Future Integrations**: n8n for workflow automation, third-party APIs for product data

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/page.tsx`: Main page component
- `src/app/components/`: React components
  - `ChatContainer.tsx`: Main container for the chat interface
  - `ChatMessage.tsx`: Component for individual messages
  - `ChatInput.tsx`: Component for user input (text, link, image upload)
  - `ProductCard.tsx`: Component for displaying dupe recommendations
- `src/app/api/dupes/`: API routes for dupe recommendations
- `src/app/types.ts`: TypeScript type definitions

## Future Enhancements

- Integration with real product databases
- User authentication and saved favorites
- Price tracking and notifications
- More sophisticated product matching algorithms
- Mobile app version

## License

This project is licensed under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
