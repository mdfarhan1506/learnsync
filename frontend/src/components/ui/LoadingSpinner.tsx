import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full w-full py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );
}