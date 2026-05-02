import React, { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import ClassSelector from './components/ClassSelector.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import SuggestedPrompts from './components/SuggestedPrompts.jsx';
import { sendChatMessage } from './services/api.js';

export default function App() {
  const [classLevel, setClassLevel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || !classLevel) return;

    // 1. Add user message
    const newUserMsg = { role: 'user', text };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    // 2. Prepare history (last 6 messages)
    const history = messages
      .slice(-6) // Take last 6
      .map(m => ({
        role: m.role,
        text: m.text
      }));

    // 3. Call API
    const response = await sendChatMessage(classLevel, text, history);

    if (response.success) {
      // Success: Add assistant answer
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.data.answer,
          subject: response.data.subject,
          topic: response.data.topic
        }
      ]);
    } else {
      // Error: Show backend error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          text: response.message
        }
      ]);
    }

    setIsLoading(false);
  }, [classLevel, messages]);

  const handleClassSelect = (level) => {
    setClassLevel(level);
    setMessages([]); // Reset chat when changing class
  };

  const handleChangeClass = () => {
    setClassLevel(null);
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden">
      <Header 
        selectedClass={classLevel} 
        onChangeClass={handleChangeClass} 
      />

      <main className="flex flex-col h-screen pt-16">
        {!classLevel ? (
          <ClassSelector onSelect={handleClassSelect} />
        ) : (
          <>
            <div className={`flex flex-col flex-1 h-full relative ${messages.length === 0 ? 'justify-center' : ''}`}>
              {messages.length === 0 && (
                <SuggestedPrompts 
                  classLevel={classLevel} 
                  onSelect={handleSendMessage} 
                />
              )}
              
              <ChatWindow 
                messages={messages} 
                isLoading={isLoading} 
              />
            </div>
            
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
            />
          </>
        )}
      </main>
    </div>
  );
}
