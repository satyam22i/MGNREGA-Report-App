import React from 'react';
import { XCircle } from 'lucide-react';

export default function Modal({ title, message, onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          OK
        </button>
      </div>
    </div>
  );
}
