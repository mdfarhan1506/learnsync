import React from 'react';
import { StatusBadge } from './StatusBadge';
import { MasteryBar } from './MasteryBar';

export function SkillCard({ skill, status, percentage }: { skill: string, status: any, percentage: number }) {
  return (
    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-slate-800">{skill}</h4>
        <StatusBadge status={status} />
      </div>
      <MasteryBar percentage={percentage} status={status} />
      <div className="text-right mt-1 text-xs text-slate-500">{percentage}% Mastery</div>
    </div>
  );
}