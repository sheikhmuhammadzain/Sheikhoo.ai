import React, { useState, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Footer } from './components/Footer';
import { useChat } from './hooks/useChat';

export default function App() {
  const [error, setError] = useState(null);
  const { messages, isLoading, sendMessage } = useChat();

  useEffect(() => {
    // Check for environment variables
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('API key not configured. Please check environment variables.');
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-zinc-900 p-4">
        <div className="max-w-md w-full backdrop-blur-xl bg-zinc-900/30 rounded-2xl p-8 border border-zinc-800/50 shadow-2xl">
          <h1 className="text-2xl font-geist font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <div className="space-y-4 text-sm text-zinc-500">
            <p>To fix this:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Set up environment variables in Netlify:</li>
              <ul className="pl-6 mt-2 space-y-1">
                <li>• Go to Site settings > Environment variables</li>
                <li>• Add VITE_GEMINI_API_KEY with your API key</li>
                <li>• Trigger a new deployment</li>
              </ul>
              <li>Or locally:</li>
              <ul className="pl-6 mt-2 space-y-1">
                <li>• Create a .env file in the project root</li>
                <li>• Add VITE_GEMINI_API_KEY=your_api_key</li>
                <li>• Restart the development server</li>
              </ul>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="relative flex flex-col h-full">
        <ChatHeader />
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
        <Footer />
      </div>
    </div>
  );
}