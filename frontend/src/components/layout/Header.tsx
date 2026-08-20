import React from 'react';
import { Menu, Bell, ChevronDown, LogOut, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useClassStore } from '../../stores/classStore';
import { useNavigate } from 'react-router-dom';
import { demoAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const currentClass = useClassStore((s) => s.currentClass);
  const navigate = useNavigate();
  const [resetting, setResetting] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDemoReset = async () => {
    if (!confirm('Reset all demo data to original state? This cannot be undone.')) return;
    setResetting(true);
    try {
      await demoAPI.reset();
      toast.success('Demo data reset! Refreshing...', { duration: 2000 });
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      toast.error('Failed to reset demo data');
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          {currentClass ? (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
              {currentClass.name} · {currentClass.subject}
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-sm">
              No class selected
            </span>
          )}
        </div>
        <span className="hidden md:inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
          DEMO DATA
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDemoReset}
          disabled={resetting}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset Demo Data"
        >
          <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
          <span className="hidden md:inline">Reset Demo</span>
        </button>

        <button className="p-2 text-slate-500 hover:text-slate-900 rounded-lg relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0] ?? 'T'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-800 leading-none">{user?.name ?? 'Teacher'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.role ?? 'Teacher'}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-500 rounded" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
