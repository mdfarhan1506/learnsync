import os

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'src/pages/InterventionPage.tsx': r'''import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InterventionPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl">
        <div>
          <h2 className="font-bold text-lg">Group 1 • Regrouping</h2>
          <p className="text-slate-300 text-sm">7 Students</p>
        </div>
        <button onClick={() => navigate('/groups/1/quick-check')} className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm">
          Run Quick Check
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Base-10 Block Subtraction</h1>
          <span className="px-3 py-1 bg-primary-100 text-primary-800 font-bold rounded-full text-sm">15 MINS</span>
        </div>
        
        <h3 className="font-bold text-slate-700 mb-2">OBJECTIVE</h3>
        <p className="mb-6 text-slate-600">Students will use physical or virtual base-10 blocks to visually understand borrowing across zeros.</p>
        
        <h3 className="font-bold text-slate-700 mb-2">MATERIALS</h3>
        <ul className="list-disc pl-5 mb-6 text-slate-600">
          <li>Base-10 blocks (hundreds, tens, ones)</li>
          <li>Whiteboard and markers</li>
        </ul>

        <h3 className="font-bold text-slate-700 mb-4">STEP-BY-STEP</h3>
        <div className="space-y-4 text-lg">
          <div className="flex">
            <span className="font-bold text-primary-600 w-8">1.</span>
            <p>Write <span className="font-bold">504 - 289</span> on the board.</p>
          </div>
          <div className="flex">
            <span className="font-bold text-primary-600 w-8">2.</span>
            <p>Ask students to build 504 using base-10 blocks (5 hundreds, 0 tens, 4 ones).</p>
          </div>
          <div className="flex">
            <span className="font-bold text-primary-600 w-8">3.</span>
            <p>Highlight the problem: "We need to take away 9 ones, but we only have 4. We look to the tens place, but there are 0 tens!"</p>
          </div>
          <div className="flex">
            <span className="font-bold text-primary-600 w-8">4.</span>
            <p>Demonstrate breaking 1 hundred into 10 tens, then breaking 1 ten into 10 ones.</p>
          </div>
        </div>
      </div>
    </div>
  );
}''',
    'src/pages/ProgressPage.tsx': r'''import React from 'react';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Class Progress</h1>
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">DEMO DATA</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Avg Mastery</p>
          <p className="text-3xl font-bold text-primary-600 mt-2">78%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Mastered</p>
          <p className="text-3xl font-bold text-green-600 mt-2">25</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Developing</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">10</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Needs Support</p>
          <p className="text-3xl font-bold text-red-600 mt-2">5</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">INTERVENTION HISTORY</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-2 px-4 font-medium text-slate-600">Date</th>
              <th className="py-2 px-4 font-medium text-slate-600">Group</th>
              <th className="py-2 px-4 font-medium text-slate-600">Skill</th>
              <th className="py-2 px-4 font-medium text-slate-600">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 px-4">Oct 12</td>
              <td className="py-3 px-4">Group 1</td>
              <td className="py-3 px-4">Regrouping</td>
              <td className="py-3 px-4 font-medium text-green-600">3 students moved up</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}''',
    'src/pages/RulesPage.tsx': r'''import React from 'react';

export default function RulesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Rules & Settings</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Skill Mastery Thresholds</h2>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h3 className="font-bold text-red-800">Needs Support</h3>
            <p className="text-2xl font-bold mt-2 text-red-600">&lt; 50%</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h3 className="font-bold text-yellow-800">Developing</h3>
            <p className="text-2xl font-bold mt-2 text-yellow-600">50 - 79%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-bold text-green-800">Mastered</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">&ge; 80%</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mt-8">Group Settings</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-700">Min questions for skill classification</span>
            <input type="number" defaultValue={2} className="w-20 px-3 py-1 border border-slate-300 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-700">Max group size</span>
            <input type="number" defaultValue={12} className="w-20 px-3 py-1 border border-slate-300 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-700">Quick check question count</span>
            <input type="number" defaultValue={3} className="w-20 px-3 py-1 border border-slate-300 rounded" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-right">
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium">Save Rules</button>
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

print("Batch 7 written.")
