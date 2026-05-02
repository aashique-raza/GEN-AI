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

 const handleSendMessage = useCallback(
  async (text) => {
    const userText = text.trim();

    if (isLoading || !userText || !classLevel) return;

    const newUserMsg = {
      role: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .filter((m) => !m.isError)
      .slice(-6)
      .map((m) => ({
        role: m.role,
        text: m.text,
      }));

    try {
      const response = await sendChatMessage(classLevel, userText, history);

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: response.data.answer,
            subject: response.data.subject,
            topic: response.data.topic,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              response.displayMessage ||
              response.errors?.reason ||
              response.message ||
              "Something went wrong.",
            isError: true,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Network error. Please make sure the backend is running.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  },
  [classLevel, messages, isLoading]
);

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
