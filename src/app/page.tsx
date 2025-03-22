import ChatContainer from './components/ChatContainer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-pink-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-pink-200 dark:border-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            StealthDupe
          </h1>
          <p className="text-sm text-pink-500 dark:text-pink-300">
            Find affordable alternatives to your favorite beauty products
          </p>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ChatContainer />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-pink-200 dark:border-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-center text-pink-500 dark:text-pink-300">
            &copy; {new Date().getFullYear()} StealthDupe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
