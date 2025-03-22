'use client';

import { useState, useEffect } from 'react';
import { Message, MessageType } from '../types';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDoneTyping, setIsDoneTyping] = useState(!message.isTyping);

  // Typing animation effect for AI messages
  useEffect(() => {
    if (message.type === MessageType.AI && !message.isTyping && !isDoneTyping) {
      const interval = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayText(message.content.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          clearInterval(interval);
          setIsDoneTyping(true);
        }
      }, 15); // Speed of typing animation

      return () => clearInterval(interval);
    }
  }, [message, currentIndex, isDoneTyping]);

  // Reset typing animation when message changes
  useEffect(() => {
    if (message.type === MessageType.AI && !message.isTyping) {
      setDisplayText('');
      setCurrentIndex(0);
      setIsDoneTyping(false);
    } else if (message.type === MessageType.User) {
      setDisplayText(message.content);
      setIsDoneTyping(true);
    }
  }, [message]);

  const isAI = message.type === MessageType.AI;
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-[80%] rounded-lg p-4 ${
          isAI 
            ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-pink-200 dark:border-pink-800 shadow-md' 
            : 'bg-pink-500 text-white'
        }`}
      >
        {message.isTyping ? (
          <div className="flex space-x-2 items-center">
            <div className="w-2 h-2 bg-pink-300 dark:bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-pink-300 dark:bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-300 dark:bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap">{isAI && !isDoneTyping ? displayText : message.content}</div>
            
            {/* Product recommendations */}
            {message.products && message.products.length > 0 && isDoneTyping && (
              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {message.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Detailed product information */}
                <ProductDetails products={message.products} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 