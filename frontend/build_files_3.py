import os
import json

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'src/components/ui/StatusBadge.tsx': '''import React from 'react';

type Status = 'mastered' | 'developing' | 'needs_support' | 'advanced' | 'unknown';

export function StatusBadge({ status, label }: { status: Status, label?: string }) {
  const displayLabel = label || status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-${status}`}>
      {displayLabel}
    </span>
  );
}''',
    'src/components/ui/MasteryBar.tsx': '''import React from 'react';

export function MasteryBar({ percentage, status }: { percentage: number, status: string }) {
  const bgColor = status === 'mastered' ? 'bg-green-500' : status === 'developing' ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
}''',
    'src/components/ui/SkillCard.tsx': '''import React from 'react';
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
}''',
    'src/components/ui/GroupCard.tsx': '''import React from 'react';

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
}''',
    'src/components/ui/LoadingSpinner.tsx': '''import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full w-full py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
}''',
    'src/components/ui/EmptyState.tsx': '''import React from 'react';
import { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, message, action }: { icon: LucideIcon, title: string, message: string, action?: React.ReactNode }) {
  return (
    <div className="text-center p-8 bg-white border border-gray-100 rounded-xl shadow-sm">
      <Icon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto mb-6">{message}</p>
      {action}
    </div>
  );
}''',
    'src/components/ui/Modal.tsx': '''import React from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}'''
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)

print("Batch 3 written.")
