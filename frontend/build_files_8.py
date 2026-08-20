import os

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'src/pages/ActivitiesPage.tsx': r'''import React from 'react';

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Activity Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded">Intervention</span>
          <h2 className="text-lg font-bold mt-2">Base-10 Block Subtraction</h2>
          <p className="text-sm text-slate-500 mt-1">Skill: Regrouping</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">Extension</span>
          <h2 className="text-lg font-bold mt-2">Logic Puzzles</h2>
          <p className="text-sm text-slate-500 mt-1">Skill: Advanced Logic</p>
        </div>
      </div>
    </div>
  );
}''',
    'src/pages/AssessmentDetailPage.tsx': r'''import React from 'react';

export default function AssessmentDetailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Assessment Detail</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p>This is a placeholder for the Assessment Detail page.</p>
      </div>
    </div>
  );
}''',
    'src/pages/AssessmentResultsPage.tsx': r'''import React from 'react';

export default function AssessmentResultsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Assessment Results</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p>This is a placeholder for the Assessment Results page.</p>
      </div>
    </div>
  );
}''',
    'src/pages/DigitalDeliveryPage.tsx': r'''import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function DigitalDeliveryPage() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Join the Assessment!</h1>
      <div className="bg-white p-12 rounded-xl shadow-lg inline-block border border-gray-100">
        <h2 className="text-6xl font-black tracking-widest text-primary-600 mb-8">5A-MATH-01</h2>
        <div className="flex justify-center mb-8">
          <QRCodeSVG value="https://learnsync.demo/join/5A-MATH-01" size={256} />
        </div>
        <p className="text-xl text-slate-600 mb-8">Go to <span className="font-bold">learnsync.test/join</span></p>
        <button className="px-12 py-4 bg-green-600 text-white text-xl font-bold rounded-xl shadow-sm hover:bg-green-700 transition-colors">
          START ASSESSMENT
        </button>
      </div>
    </div>
  );
}''',
    'src/pages/ClassDetailPage.tsx': r'''import React from 'react';

export default function ClassDetailPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Class 5A Detail</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p>This is a placeholder for the Class Detail page.</p>
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

print("Batch 8 written.")
