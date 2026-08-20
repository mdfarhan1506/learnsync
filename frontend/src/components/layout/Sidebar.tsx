import React from 'react';
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
}