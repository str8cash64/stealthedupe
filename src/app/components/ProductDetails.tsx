'use client';

import { useState } from 'react';
import { Product } from '../types';
import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

interface ProductDetailsProps {
  products: Product[];
}

export default function ProductDetails({ products }: ProductDetailsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('ingredients');

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="bg-pink-50 dark:bg-gray-900 rounded-lg border border-pink-200 dark:border-pink-800 overflow-hidden">
      <div className="px-4 py-3 bg-pink-100 dark:bg-gray-800 border-b border-pink-200 dark:border-pink-800">
        <h3 className="text-lg font-medium text-pink-800 dark:text-pink-300">Detailed Analysis</h3>
      </div>
      
      {/* Ingredients Section */}
      <div className="border-b border-pink-200 dark:border-pink-800">
        <button
          onClick={() => toggleSection('ingredients')}
          className="flex justify-between items-center w-full px-4 py-3 text-left text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center">
            <FiInfo className="mr-2" />
            <span className="font-medium">Ingredients Analysis</span>
          </div>
          {expandedSection === 'ingredients' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'ingredients' && (
          <div className="px-4 py-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-pink-200 dark:divide-pink-800">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Key Ingredients</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Match Score</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-pink-100 dark:divide-pink-900">
                {products.map((product) => (
                  <tr key={`ing-${product.id}`}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {product.brand} {product.name}
                      {product.color && (
                        <div className="flex items-center mt-1">
                          <div 
                            className="w-3 h-3 rounded-full mr-1 border border-gray-200" 
                            style={{ backgroundColor: product.colorHex || '#CCCCCC' }}
                          ></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{product.color}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {product.ingredients && product.ingredients.length > 0 ? (
                        <>
                          {product.ingredients.slice(0, 4).join(', ')}
                          {product.ingredients.length > 4 && '...'}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">No ingredient data available</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div 
                            className="bg-pink-600 dark:bg-pink-500 h-2.5 rounded-full" 
                            style={{ width: `${product.ingredientMatch || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{product.ingredientMatch || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Color & Finish Match */}
      <div className="border-b border-pink-200 dark:border-pink-800">
        <button
          onClick={() => toggleSection('color')}
          className="flex justify-between items-center w-full px-4 py-3 text-left text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center">
            <FiInfo className="mr-2" />
            <span className="font-medium">Color & Finish Match</span>
          </div>
          {expandedSection === 'color' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'color' && (
          <div className="px-4 py-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-pink-200 dark:divide-pink-800">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Color</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Finish</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Color Match</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-pink-100 dark:divide-pink-900">
                {products.map((product) => {
                  // Extract finish from product name (common terms like matte, satin, gloss, etc.)
                  const finishTerms = ['matte', 'satin', 'gloss', 'glossy', 'creamy', 'shine', 'metallic', 'velvet', 'dewy'];
                  const finish = finishTerms.find(term => 
                    product.name.toLowerCase().includes(term)
                  ) || 'Standard';
                  
                  return (
                    <tr key={`color-${product.id}`}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{product.brand} {product.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2 border border-gray-200" 
                            style={{ backgroundColor: product.colorHex || '#CCCCCC' }}
                          ></div>
                          {product.color || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {finish.charAt(0).toUpperCase() + finish.slice(1)}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-[100px]">
                            <div 
                              className="bg-pink-600 dark:bg-pink-500 h-2.5 rounded-full" 
                              style={{ width: `${product.colorMatch || 0}%` }}
                            ></div>
                          </div>
                          <span>{product.colorMatch || 0}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Overall Similarity */}
      <div className="border-b border-pink-200 dark:border-pink-800">
        <button
          onClick={() => toggleSection('similarity')}
          className="flex justify-between items-center w-full px-4 py-3 text-left text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center">
            <FiInfo className="mr-2" />
            <span className="font-medium">Overall Similarity</span>
          </div>
          {expandedSection === 'similarity' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'similarity' && (
          <div className="px-4 py-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-pink-200 dark:divide-pink-800">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Overall Score</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Ingredients</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Color</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-pink-600 dark:text-pink-300 uppercase tracking-wider">Finish</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-pink-100 dark:divide-pink-900">
                {products.map((product) => (
                  <tr key={`sim-${product.id}`}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {product.brand} {product.name}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div 
                            className="bg-pink-600 dark:bg-pink-500 h-2.5 rounded-full" 
                            style={{ width: `${product.similarityScore || 0}%` }}
                          ></div>
                        </div>
                        <span>{product.similarityScore || 0}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {product.ingredientMatch || 0}%
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {product.colorMatch || 0}%
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {product.finishMatch || 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Community Reviews */}
      <div className="border-b border-pink-200 dark:border-pink-800">
        <button
          onClick={() => toggleSection('reviews')}
          className="flex justify-between items-center w-full px-4 py-3 text-left text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center">
            <FiInfo className="mr-2" />
            <span className="font-medium">Community & Expert Reviews</span>
          </div>
          {expandedSection === 'reviews' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'reviews' && (
          <div className="px-4 py-3">
            {products.map((product) => {
              // Only show products with reviews
              if (!product.redditReviews && !product.expertReviews) return null;
              
              return (
                <div key={`reviews-${product.id}`} className="mb-4 last:mb-0">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {product.brand} {product.name}
                  </h4>
                  
                  {product.expertReviews && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 border border-pink-100 dark:border-pink-800">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                          {product.expertReviews.source}
                        </span>
                        <span className="text-xs font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full">
                          {product.expertReviews.rating}/100
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{product.expertReviews.quote}"
                      </p>
                    </div>
                  )}
                  
                  {product.redditReviews && product.redditReviews.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Reddit User Reviews:
                      </h5>
                      {product.redditReviews.map((review, idx) => (
                        <div 
                          key={`reddit-${product.id}-${idx}`} 
                          className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-2 last:mb-0 border border-pink-100 dark:border-pink-800"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Anonymous user • {review.date}
                            </span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xs ${i < review.rating ? 'text-pink-500' : 'text-gray-300 dark:text-gray-600'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {review.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {!products.some(p => p.redditReviews || p.expertReviews) && (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center">
                No community or expert reviews available for these products.
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Price Comparison */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full px-4 py-3 text-left text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center">
            <FiInfo className="mr-2" />
            <span className="font-medium">Price Comparison</span>
          </div>
          {expandedSection === 'price' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'price' && (
          <div className="px-4 py-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-pink-100 dark:border-pink-900">
              <div className="px-4 py-3 flex justify-between items-center border-b border-pink-100 dark:border-pink-900">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Product</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</span>
              </div>
              {products.map((product, index) => (
                <div 
                  key={`price-${product.id}`} 
                  className={`px-4 py-3 flex justify-between items-center ${
                    index < products.length - 1 ? 'border-b border-pink-100 dark:border-pink-900' : ''
                  }`}
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{product.brand} {product.name}</span>
                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                    {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>These dupes offer similar benefits at a fraction of the price of high-end alternatives.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 