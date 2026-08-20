import os

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'src/pages/GroupsPage.tsx': r'''import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupCard } from '../components/ui/GroupCard';

export default function GroupsPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Learning Groups — Class 5A</h1>
        <p className="text-sm text-slate-500">Generated from assessment: Week 4 Check-in</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GroupCard name="Group 1" count={7} skill="Regrouping" status="needs_support" onAction={() => navigate('/groups/1')} />
        <GroupCard name="Group 2" count={12} skill="Regrouping" status="developing" onAction={() => navigate('/groups/2')} />
        <GroupCard name="Group 3" count={15} skill="Multiplication" status="mastered" onAction={() => navigate('/groups/3')} />
        <GroupCard name="Group 4" count={6} skill="Advanced Logic" status="advanced" onAction={() => navigate('/groups/4')} />
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-8">
        <span className="text-sm font-medium text-slate-700">Need to make manual adjustments?</span>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
          Teacher Overrides
        </button>
      </div>
    </div>
  );
}''',
    'src/pages/GroupDetailPage.tsx': r'''import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function GroupDetailPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Group 1</h1>
            <StatusBadge status="needs_support" label="Needs Support" />
          </div>
          <p className="text-slate-600 font-medium">Primary Skill: Regrouping</p>
        </div>
        <button onClick={() => navigate('/groups/1/intervention')} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-bold shadow-sm hover:bg-primary-700 transition-colors">
          GENERATE INTERVENTION
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <h3 className="font-bold text-blue-900 mb-2">WHY THIS GROUP?</h3>
        <p className="text-sm text-blue-800">7 of 7 students scored below 50% on questions mapped to Regrouping. These students share a similar primary skill gap and have been grouped for targeted intervention.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-4 font-semibold text-slate-600">Name</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Roll No</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Skill Status</th>
              <th className="py-3 px-4 font-semibold text-slate-600">Mastery %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 px-4 font-medium text-slate-800">Aarav Sharma</td>
              <td className="py-3 px-4 text-slate-500">12</td>
              <td className="py-3 px-4"><StatusBadge status="needs_support" /></td>
              <td className="py-3 px-4 text-red-600 font-medium">40%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}''',
    'src/pages/QuickCheckPage.tsx': r'''import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickCheckPage() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const handleStatus = (student: string, status: string) => {
    setStatuses(prev => ({ ...prev, [student]: status }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 text-center mb-8">Quick Check — Group 1 — Regrouping</h1>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8">
        <p className="font-medium text-slate-700 mb-2">1. 504 - 289 = ?</p>
        <p className="font-medium text-slate-700 mb-2">2. 300 - 145 = ?</p>
        <p className="font-medium text-slate-700">3. 1000 - 456 = ?</p>
      </div>

      <div className="space-y-4">
        {['Aarav Sharma', 'Neha Gupta', 'Rohan Patel'].map((student) => (
          <div key={student} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between">
            <span className="font-bold text-lg text-slate-800 mb-4 md:mb-0 md:w-1/3">{student}</span>
            <div className="flex space-x-2 w-full md:w-2/3">
              <button 
                onClick={() => handleStatus(student, 'mastered')}
                className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm border-2 transition-colors ${statuses[student] === 'mastered' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-slate-200 text-slate-600 hover:border-green-300'}`}
              >
                ✓ MASTERED
              </button>
              <button 
                onClick={() => handleStatus(student, 'developing')}
                className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm border-2 transition-colors ${statuses[student] === 'developing' ? 'bg-yellow-100 border-yellow-500 text-yellow-800' : 'bg-white border-slate-200 text-slate-600 hover:border-yellow-300'}`}
              >
                ↔ STILL NEEDS PRACTICE
              </button>
              <button 
                onClick={() => handleStatus(student, 'needs_support')}
                className={`flex-1 py-3 px-2 rounded-lg font-bold text-sm border-2 transition-colors ${statuses[student] === 'needs_support' ? 'bg-red-100 border-red-500 text-red-800' : 'bg-white border-slate-200 text-slate-600 hover:border-red-300'}`}
              >
                ✗ NEEDS SUPPORT
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center">
        <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-primary-700 w-full md:w-auto text-lg">
          SUBMIT ALL RESULTS
        </button>
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

print("Batch 6 written.")
