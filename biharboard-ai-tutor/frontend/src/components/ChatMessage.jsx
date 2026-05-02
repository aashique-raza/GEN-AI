import React from 'react';
import { motion } from 'motion/react';
import { User, Bot, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ role, text, subject, topic }) {
  const isError = role === 'error';
  const isAssistant = role === 'assistant';
  const isBotMessage = isAssistant || isError;

  const formattedText = String(text || '')
    .replace(/\*\*(Simple Explanation|Bihar Board Exam Point of View|Example|Note|Important):\*\*/g, '\n\n**$1:**\n')
    .trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-6 w-full ${isBotMessage ? '' : 'flex-row-reverse'}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isBotMessage
            ? isError
              ? 'bg-red-50 border border-red-100'
              : 'bg-blue-600'
            : 'bg-gray-200'
        }`}
      >
        {isBotMessage ? (
          isError ? (
            <AlertCircle className="text-red-500 size-5" />
          ) : (
            <Bot className="text-white size-5" />
          )
        ) : (
          <User className="text-gray-600 size-5" />
        )}
      </div>

      <div
        className={`max-w-[90%] sm:max-w-[75%] lg:max-w-[65%] flex flex-col ${
          isBotMessage ? 'items-start' : 'items-end'
        }`}
      >
        <div
          className={`px-5 py-4 rounded-2xl text-[15px] leading-7 break-words ${
            isBotMessage
              ? isError
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              : 'bg-blue-600 text-white shadow-sm'
          }`}
        >
          {isBotMessage ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-950">
                    {children}
                  </strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 mb-3 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-3 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-7">{children}</li>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ),
              }}
            >
              {formattedText}
            </ReactMarkdown>
          ) : (
            <span>{text}</span>
          )}
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