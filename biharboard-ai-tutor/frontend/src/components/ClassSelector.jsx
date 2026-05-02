import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Book } from 'lucide-react';

export default function ClassSelector({ onSelect }) {
  const options = [
    { id: '10', label: 'Class 10', icon: Book, description: 'Syllabus, Books & Exam Guide for Matric (Class 10)' },
    { id: '12', label: 'Class 12', icon: GraduationCap, description: 'Stream-wise support for Intermediate (Class 12)' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">BiharBoard AI Tutor</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          AI study assistant for Bihar Board Class 10 and Class 12 students. Get instant answers to your academic queries.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.id)}
            className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <opt.icon className="text-blue-600 size-8 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{opt.label}</h3>
            <p className="text-gray-500 text-sm">{opt.description}</p>
          </motion.button>
        ))}
      </div>

      <p className="mt-12 text-xs text-gray-400 font-medium">
        ONLY BIHAR BOARD CLASS 10 & 12 SYLLABUS SUPPORTED
      </p>
    </div>
  );
}
