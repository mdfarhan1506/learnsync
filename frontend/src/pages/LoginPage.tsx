import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useClassStore } from '../stores/classStore';
import { classAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setCurrentClass = useClassStore((s) => s.setCurrentClass);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      setAuth(res.data.user, res.data.token);
      // Auto-select first class
      const classRes = await classAPI.list();
      if (classRes.data.length > 0) {
        const c = classRes.data[0];
        setCurrentClass({ id: c.id, name: c.name, grade: c.grade, subject: c.subject, section: c.section });
      }
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('teacher@learnsync.demo');
    setPassword('demo1234');
    setLoading(true);
    try {
      const res = await authAPI.login('teacher@learnsync.demo', 'demo1234');
      setAuth(res.data.user, res.data.token);
      const classRes = await classAPI.list();
      if (classRes.data.length > 0) {
        const c = classRes.data[0];
        setCurrentClass({ id: c.id, name: c.name, grade: c.grade, subject: c.subject, section: c.section });
      }
      toast.success('Demo mode activated!');
      navigate('/dashboard');
    } catch {
      toast.error('Demo login failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-center px-14 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black text-white text-lg">L</div>
            <span className="text-3xl font-black tracking-tight">LEARNsync</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-200 mb-3 leading-snug">
            Adaptive Classroom<br />Learning Orchestration
          </h2>
          <p className="text-lg text-blue-300 font-medium mb-10 italic">
            "Turn assessment data into classroom action."
          </p>
          <div className="space-y-4">
            {[
              { icon: '🎯', text: 'Skill-level diagnosis — not just total scores' },
              { icon: '👥', text: 'Automatic learning groups with explanations' },
              { icon: '⚡', text: 'AI-generated classroom interventions' },
              { icon: '🔄', text: 'Closed-loop: Assess → Group → Intervene → Update' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              40 students · One teacher · Different learning levels.<br />
              LEARNsync tells you exactly what to do next.
            </p>
          </div>
        </div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">L</div>
              <span className="text-2xl font-black text-slate-900">LEARNsync</span>
            </div>
            <p className="text-slate-500 text-sm">Adaptive Classroom Learning Orchestration</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your teacher account</p>

          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-slate-900"
                placeholder="teacher@school.edu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-400">or</span></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            <span>🎓</span>
            Use Demo Account
          </button>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 text-center font-medium">Demo: teacher@learnsync.demo · demo1234</p>
            <p className="text-xs text-blue-500 text-center mt-0.5">All data is fictional and for demonstration purposes only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
