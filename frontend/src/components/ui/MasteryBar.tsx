import React from 'react';

export function MasteryBar({ percentage, status }: { percentage: number, status: string }) {
  const bgColor = status === 'mastered' ? 'bg-green-500' : status === 'developing' ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
}