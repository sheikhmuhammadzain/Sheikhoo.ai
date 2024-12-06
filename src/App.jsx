import React from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Footer } from './components/Footer';
import { useChat } from './hooks/useChat';

export default function App() {
  const { messages, isLoading, sendMessage } = useChat();

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