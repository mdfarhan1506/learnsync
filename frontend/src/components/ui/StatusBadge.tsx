import React from 'react';

type Status = 'mastered' | 'developing' | 'needs_support' | 'advanced' | 'unknown';

export function StatusBadge({ status, label }: { status: Status, label?: string }) {
  const displayLabel = label || status.replace('_', ' ').replace(/\w/g, l => l.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium status-${status}`}>
      {displayLabel}
    </span>
  );
}