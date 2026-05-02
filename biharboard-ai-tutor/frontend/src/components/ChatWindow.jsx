import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage.jsx";
import { Loader2 } from "lucide-react";

export default function ChatWindow({ messages, isLoading }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-24 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full scroll-smooth"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
          <p className="text-sm">
            Ask any question related to your Bihar Board syllabus.
          </p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            role={msg.role}
            text={msg.text}
            subject={msg.subject}
            topic={msg.topic}
          />
        ))
      )}

      {isLoading && (
        <div className="flex gap-3 mb-6 animate-pulse">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Loader2 className="text-blue-400 size-5 animate-spin" />
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center gap-2">
            <span className="text-gray-400 text-sm">
              AI Tutor is thinking...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
