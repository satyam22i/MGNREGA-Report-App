import React from 'react';

export default function DataCard({ title, value, icon, iconBg }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
      <div className={`flex-shrink-0 ${iconBg} p-3 rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
