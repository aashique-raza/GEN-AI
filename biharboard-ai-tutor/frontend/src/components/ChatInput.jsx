import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-linear-to-t from-gray-50 via-gray-50 to-transparent pt-10 pb-6 px-4">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-white rounded-2xl border border-gray-200 shadow-lg p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <textarea
            ref={textareaRef}
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your study doubt..."
            className="flex-1 max-h-[150px] overflow-y-auto px-3 py-3 text-sm text-gray-800 placeholder-gray-400 border-none focus:ring-0 resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all ${
              !input.trim() || isLoading
                ? 'bg-gray-100 text-gray-400 pointer-events-none'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform active:scale-95'
            }`}
          >
            <SendHorizonal className="size-5" />
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-400 mt-2 font-medium uppercase tracking-wider">
          Bihar Board Syllabus Only • Support for Class 10 & 12
        </p>
      </div>
    </div>
  );
}
