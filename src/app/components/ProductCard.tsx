'use client';

import Image from 'next/image';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use similarityScore as the main match score
  const matchScore = product.similarityScore || product.colorMatch || 0;
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-pink-100 dark:border-pink-800">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-0 right-0 bg-pink-500 text-white px-2 py-1 text-xs font-bold">
          DUPE
        </div>
        {matchScore > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div className="flex items-center">
              <div className="w-full bg-gray-300/50 rounded-full h-1.5 mr-2">
                <div 
                  className="bg-pink-500 h-1.5 rounded-full" 
                  style={{ width: `${matchScore}%` }}
                ></div>
              </div>
              <span className="text-xs text-white font-medium">{matchScore}% match</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-pink-500 dark:text-pink-400 mb-1 font-medium">{product.brand}</p>
        <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
        
        {product.color && (
          <div className="flex items-center mb-2">
            <div 
              className="w-4 h-4 rounded-full mr-2 border border-gray-200" 
              style={{ backgroundColor: product.colorHex || '#CCCCCC' }}
            ></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">{product.color}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
            {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
          </span>
          <a 
            href={product.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-full transition-colors"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
} 