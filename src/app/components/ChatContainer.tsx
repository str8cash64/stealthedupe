'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message, MessageType } from '../types';

// Define an interface for message history
interface MessageHistory {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: MessageType.AI,
      content: "Hi there! I'm your beauty product dupe finder. Share a product link, upload an image, or describe what you're looking for, and I'll find affordable alternatives for you!",
      isTyping: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([
    {
      role: 'assistant',
      content: "Hi there! I'm your beauty product dupe finder. Share a product link, upload an image, or describe what you're looking for, and I'll find affordable alternatives for you!",
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, type: 'text' | 'link' | 'image', imageFile?: File) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: MessageType.USER,
      content,
      isTyping: false,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Add user message to history
    const userHistoryMessage: MessageHistory = {
      role: 'user',
      content,
    };
    setMessageHistory((prev) => [...prev, userHistoryMessage]);
    
    setIsLoading(true);

    // Add AI typing indicator
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: MessageType.AI,
      content: '',
      isTyping: true,
    };
    
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Call API to get dupe recommendations
      const response = await fetch('/api/dupes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: content,
          type,
          messageHistory, // Send message history to the API
          // If we had image upload, we'd handle it differently
        }),
      });

      const data = await response.json();
      
      // Add AI response to the message history
      const aiHistoryMessage: MessageHistory = {
        role: 'assistant',
        content: data.message,
      };
      setMessageHistory((prev) => [...prev, aiHistoryMessage]);

      // Remove typing indicator and add AI response
      setMessages((prev) => 
        prev.filter(msg => !msg.isTyping).concat({
          id: Date.now().toString(),
          type: MessageType.AI,
          content: data.message,
          products: data.products,
          analysisInsights: data.analysisInsights,
          comparedTo: data.comparedTo,
          isTyping: false,
        })
      );
    } catch (error) {
      console.error('Error fetching dupes:', error);
      
      // Add error to message history
      const errorHistoryMessage: MessageHistory = {
        role: 'assistant',
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessageHistory((prev) => [...prev, errorHistoryMessage]);
      
      // Remove typing indicator and add error message
      setMessages((prev) => 
        prev.filter(msg => !msg.isTyping).concat({
          id: Date.now().toString(),
          type: MessageType.AI,
          content: "Sorry, I couldn't process your request. Please try again.",
          isTyping: false,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
} 