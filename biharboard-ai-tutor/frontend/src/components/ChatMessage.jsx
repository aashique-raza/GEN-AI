import React from 'react';
import { motion } from 'motion/react';
import { User, Bot, AlertCircle } from 'lucide-react';

export default function ChatMessage({ role, text, subject, topic }) {
  const isAssistant = role === 'assistant';
  const isError = role === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-6 w-full ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
        isAssistant ? (isError ? 'bg-red-50' : 'bg-blue-600') : 'bg-gray-200'
      }`}>
        {isAssistant ? (
          isError ? <AlertCircle className="text-red-500 size-5" /> : <Bot className="text-white size-5" />
        ) : (
          <User className="text-gray-600 size-5" />
        )}
      </div>

      <div className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
          isAssistant 
            ? (isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white text-gray-800 border border-gray-100 shadow-sm') 
            : 'bg-blue-600 text-white shadow-sm'
        }`}>
          {text}
        </div>
        
        {isAssistant && !isError && (subject || topic) && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 max-w-full">
            {subject && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                {subject}
              </span>
            )}
            {topic && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                {topic}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
