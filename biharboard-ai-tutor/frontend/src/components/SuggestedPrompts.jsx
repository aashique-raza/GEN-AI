import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedPrompts({ classLevel, onSelect }) {
  const prompts = {
    '10': [
      "photosynthesis samjhao",
      "loktantra ke gun batao",
      "quadratic equation kya hota hai",
      "acid base aur salt short notes do"
    ],
    '12': [
      "electric field kya hota hai",
      "DNA replication samjhao",
      "p-block elements ka short note do",
      "national income kya hota hai"
    ]
  };

  const currentPrompts = prompts[classLevel] || [];

  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-4">
        <Sparkles className="size-3" />
        <span>Try these topics</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {currentPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(prompt)}
            className="text-xs bg-white text-gray-700 font-medium px-4 py-2.5 rounded-xl border border-gray-100 shadow-xs hover:border-blue-300 hover:text-blue-600 transition-all text-left transform active:scale-95"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
}
