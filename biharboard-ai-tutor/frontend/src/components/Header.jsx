import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Header({ selectedClass, onChangeClass }) {
  return (
    <header className="bg-white border-b border-gray-100 py-4 px-6 fixed top-0 w-full z-10 flex justify-between items-center shadow-xs">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <BookOpen className="text-white size-5" />
        </div>
        <h1 className="font-bold text-gray-900 text-lg hidden sm:block">BiharBoard AI Tutor</h1>
        <h1 className="font-bold text-gray-900 text-lg sm:hidden">AI Tutor</h1>
      </div>

      {selectedClass && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
            Class {selectedClass}
          </span>
          <button
            onClick={onChangeClass}
            className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            Change Class
          </button>
        </div>
      )}
    </header>
  );
}
