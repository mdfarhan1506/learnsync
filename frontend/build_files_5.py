import os

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'src/pages/StudentProfilePage.tsx': r'''import React from 'react';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Aarav Sharma</h1>
          <p className="text-slate-500">Roll No: 12 • Class 5A • Group 2</p>
        </div>
        <StatusBadge status="developing" label="Developing Overall" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">SKILL MASTERY</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-semibold text-sm text-slate-600">Skill</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600">Status</th>
                <th className="py-3 px-4 font-semibold text-sm text-slate-600">Mastery %</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4">Addition</td>
                <td className="py-3 px-4"><StatusBadge status="mastered" /></td>
                <td className="py-3 px-4 text-green-600 font-medium">95%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4">Regrouping</td>
                <td className="py-3 px-4"><StatusBadge status="needs_support" /></td>
                <td className="py-3 px-4 text-red-600 font-medium">40%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-slate-800 mb-4">LEARNING TIMELINE</h2>
           <div className="space-y-4 relative border-l-2 border-slate-200 ml-3 pl-4">
             <div className="relative">
               <div className="absolute -left-[21px] w-3 h-3 bg-primary-500 rounded-full top-1.5"></div>
               <p className="text-sm font-semibold">Quick Check: Regrouping</p>
               <p className="text-xs text-slate-500">Oct 12 • Moved to Needs Support</p>
             </div>
             <div className="relative">
               <div className="absolute -left-[21px] w-3 h-3 bg-green-500 rounded-full top-1.5"></div>
               <p className="text-sm font-semibold">Diagnostic Assessment</p>
               <p className="text-xs text-slate-500">Oct 1</p>
             </div>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-lg font-bold text-slate-800 mb-4">TEACHER OBSERVATIONS</h2>
           <p className="text-sm text-slate-600 mb-4">Struggles with borrowing across zeros.</p>
           <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2" rows={3} placeholder="Add a new observation..."></textarea>
           <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">Save Note</button>
        </div>
      </div>
    </div>
  );
}''',
    'src/pages/AssessmentsPage.tsx': r'''import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function AssessmentsPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Assessments</h1>
        <button onClick={() => navigate('/assessments/new')} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          + New Assessment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3 px-4 font-semibold text-sm text-slate-600">Title</th>
              <th className="py-3 px-4 font-semibold text-sm text-slate-600">Class</th>
              <th className="py-3 px-4 font-semibold text-sm text-slate-600">Status</th>
              <th className="py-3 px-4 font-semibold text-sm text-slate-600">Date</th>
              <th className="py-3 px-4 font-semibold text-sm text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 px-4 font-medium text-slate-800">Week 4 Check-in</td>
              <td className="py-3 px-4 text-slate-600">5A Math</td>
              <td className="py-3 px-4"><StatusBadge status="mastered" label="Completed" /></td>
              <td className="py-3 px-4 text-slate-600">Oct 10, 2023</td>
              <td className="py-3 px-4">
                <button onClick={() => navigate('/assessments/1')} className="text-primary-600 font-medium hover:underline text-sm">View Results</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}''',
    'src/pages/NewAssessmentPage.tsx': r'''import React, { useState } from 'react';

export default function NewAssessmentPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Create New Assessment</h1>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1. Configure</div>
        <div className={`h-1 w-8 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2. Review Questions</div>
      </div>

      {step === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg"><option>5A Math</option></select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="e.g. Regrouping" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
            <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg" defaultValue={5} />
          </div>
          <button onClick={() => setStep(2)} className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium mt-4">
            Generate Questions
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">Q1</span>
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded border border-primary-200">Skill: Subtraction</span>
            </div>
            <p className="font-medium text-slate-800 mb-4">What is 504 - 289?</p>
            <div className="space-y-2">
              <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">A. 215</div>
              <div className="px-3 py-2 border border-green-500 rounded-lg bg-green-50 font-medium">B. 215 (Correct)</div>
              <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">C. 315</div>
              <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">D. 225</div>
            </div>
          </div>
          <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium">
            Approve & Publish
          </button>
        </div>
      )}
    </div>
  );
}'''
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)

print("Batch 5 written.")
