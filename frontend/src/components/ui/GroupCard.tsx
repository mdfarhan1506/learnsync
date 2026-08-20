import React from 'react';

export function GroupCard({ name, count, skill, avg, status, onAction }: any) {
  const borderColors: any = {
    needs_support: 'border-red-200',
    developing: 'border-yellow-200',
    mastered: 'border-green-200'
  };
  return (
    <div className={`bg-white border ${borderColors[status] || 'border-gray-100'} p-4 rounded-xl shadow-sm flex flex-col`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-slate-800">{name}</h3>
        <span className="text-sm text-slate-500">{count} students</span>
      </div>
      <p className="text-sm font-medium text-slate-700 mb-4">{skill}</p>
      <div className="mt-auto">
        <button onClick={onAction} className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          View Group
        </button>
      </div>
    </div>
  );
}