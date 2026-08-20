import React from 'react';
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
}