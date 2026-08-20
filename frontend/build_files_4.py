import os

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'src/pages/DashboardPage.tsx': r'''import React from 'react';
import { Users, Grid3X3, Calendar, AlertTriangle } from 'lucide-react';
import { GroupCard } from '../components/ui/GroupCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Good morning, Priya! Here's today's classroom overview.</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '40', icon: Users, color: 'blue' },
          { label: 'Active Groups', value: '4', icon: Grid3X3, color: 'purple' },
          { label: 'Latest Assessment', value: 'Today', icon: Calendar, color: 'green' },
          { label: 'Students Needing Attention', value: '15', icon: AlertTriangle, color: 'red' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 mr-4`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">TODAY'S CLASSROOM PLAN</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GroupCard name="Group 1" count={7} skill="Regrouping" status="needs_support" onAction={() => {}} />
            <GroupCard name="Group 2" count={12} skill="Regrouping" status="developing" onAction={() => {}} />
            <GroupCard name="Group 3" count={15} skill="Multiplication" status="mastered" onAction={() => {}} />
            <GroupCard name="Group 4" count={6} skill="Advanced Logic" status="advanced" onAction={() => {}} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">QUICK ACTIONS</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
            <button className="w-full py-2.5 px-4 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors text-left">
              + New Assessment
            </button>
            <button className="w-full py-2.5 px-4 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors text-left">
              View Groups
            </button>
            <button className="w-full py-2.5 px-4 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition-colors text-left">
              Quick Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}''',
    'src/pages/ClassesPage.tsx': r'''import React, { useState } from 'react';
import { Modal } from '../components/ui/Modal';

export default function ClassesPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Classes</h1>
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          Create Class
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-1">Class 5A - Math</h2>
          <p className="text-slate-500 mb-4">40 Students • Grade 5</p>
          <div className="space-y-2">
            <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">Open Class</button>
            <button className="w-full py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">View Groups</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Class">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="e.g. 5A Math" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="e.g. 5" />
          </div>
          <button className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium mt-4">
            Create
          </button>
        </div>
      </Modal>
    </div>
  );
}''',
    'src/pages/LoginPage.tsx': r'''import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    localStorage.setItem('ls_token', 'demo-token');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-center px-12 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">LEARNsync</h1>
          <h2 className="text-2xl text-slate-300 mb-8">Adaptive Classroom Learning Orchestration</h2>
          <p className="text-lg text-slate-400 mb-8">Turn assessment data into classroom action.</p>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3">✓</span>
              Skill-level diagnosis
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3">✓</span>
              Automatic learning groups
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3">✓</span>
              AI-generated interventions
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mr-3">✓</span>
              Closed-loop progress tracking
            </li>
          </ul>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">LEARNsync</h1>
            <p className="text-slate-500">Adaptive Classroom Learning Orchestration</p>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome back</h2>
          
          <form className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="teacher@school.edu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="••••••••" />
            </div>
            <button type="button" className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Log In
            </button>
          </form>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">Or</span></div>
          </div>
          
          <button 
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition-colors mb-4"
          >
            Use Demo Account
          </button>
          
          <p className="text-center text-xs text-slate-400">
            DEMO DATA — All data is fictional
          </p>
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

print("Batch 4 written.")
