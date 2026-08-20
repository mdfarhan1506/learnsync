import os
import json

base_dir = '/Users/mdfarhan/Documents/learnsync/frontend'

files = {
    'src/components/layout/Layout.tsx': '''import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <div className={`fixed inset-0 bg-slate-900/50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}''',
    'src/components/layout/Sidebar.tsx': '''import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, School, Users, ClipboardList, Grid3X3, BookOpen, TrendingUp, Settings, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Classes', path: '/classes', icon: School },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Assessments', path: '/assessments', icon: ClipboardList },
    { name: 'Learning Groups', path: '/groups', icon: Grid3X3 },
    { name: 'Activities', path: '/activities', icon: BookOpen },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Rules & Settings', path: '/rules', icon: Settings },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wider">LEARNsync</span>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} className="mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}''',
    'src/components/layout/Header.tsx': '''import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 relative">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4 lg:hidden text-slate-500 hover:text-slate-700">
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors">
          <span className="text-sm font-semibold text-slate-700 mr-2">Class 5A - Math</span>
          <ChevronDown size={16} className="text-slate-500" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-slate-400 hover:text-slate-600 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-2">
            P
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">Priya S.</span>
        </div>
      </div>
    </header>
  );
}''',
    'src/App.tsx': '''import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div className="p-10">Login Page (WIP)</div>} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<div className="p-4">Dashboard</div>} />
          <Route path="classes" element={<div className="p-4">Classes</div>} />
          <Route path="students" element={<div className="p-4">Students</div>} />
          <Route path="assessments" element={<div className="p-4">Assessments</div>} />
          <Route path="groups" element={<div className="p-4">Groups</div>} />
          <Route path="activities" element={<div className="p-4">Activities</div>} />
          <Route path="progress" element={<div className="p-4">Progress</div>} />
          <Route path="rules" element={<div className="p-4">Rules & Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;'''
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)

print("Batch 2 written.")
