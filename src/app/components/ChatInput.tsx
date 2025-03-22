'use client';

import { useState, useRef } from 'react';
import { FiSend, FiLink, FiImage, FiX } from 'react-icons/fi';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'link' | 'image', imageFile?: File) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'text' | 'link' | 'image'>('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '' && !selectedFile) return;
    
    onSendMessage(inputValue, inputType, selectedFile || undefined);
    setInputValue('');
    setInputType('text');
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setInputType('image');
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setInputType('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    const pastedText = clipboardData.getData('text');
    
    // Check if pasted content is a URL
    const urlRegex = /^(https?:\/\/[^\s]+)/;
    if (urlRegex.test(pastedText)) {
      setInputType('link');
    } else {
      setInputType('text');
    }
  };

  return (
    <div className="border-t border-pink-200 dark:border-pink-800 p-4 bg-white dark:bg-gray-900 shadow-md">
      {imagePreview && (
        <div className="relative mb-2 inline-block">
          <div className="relative h-20 w-20 rounded overflow-hidden border border-pink-200 dark:border-pink-800">
            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
            <button 
              onClick={handleClearImage}
              className="absolute top-1 right-1 bg-pink-500 bg-opacity-70 text-white rounded-full p-1"
              aria-label="Remove image"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={handlePaste}
            placeholder={
              inputType === 'text' 
                ? "Describe a beauty product..." 
                : inputType === 'link' 
                  ? "Paste a product link..." 
                  : "Describe the uploaded image..."
            }
            className="w-full p-3 pr-10 rounded-full border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={isLoading}
          />
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="image-upload"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
          disabled={isLoading}
          aria-label="Upload image"
        >
          <FiImage size={20} />
        </button>
        
        <button
          type="submit"
          className="p-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || (inputValue.trim() === '' && !selectedFile)}
          aria-label="Send message"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
} 