import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { useAuthStore } from '../stores/authStore';
import { School, Users, ClipboardList, Grid3X3, Plus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', grade: '', section: '', subject: 'Mathematics', academicYear: '2026-2027', language: 'English' });
  const [creating, setCreating] = useState(false);
  const setCurrentClass = useClassStore(s => s.setCurrentClass);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  const fetchClasses = () => {
    classAPI.list().then(r => setClasses(r.data)).finally(() => setLoading(false));
  };
  useEffect(fetchClasses, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await classAPI.create({ ...form, teacherId: user?.id });
      toast.success('Class created!');
      setShowCreate(false);
      setForm({ name: '', grade: '', section: '', subject: 'Mathematics', academicYear: '2026-2027', language: 'English' });
      fetchClasses();
    } catch {
      toast.error('Failed to create class');
    } finally {
      setCreating(false);
    }
  };

  const handleOpen = (cls: any) => {
    setCurrentClass({ id: cls.id, name: cls.name, grade: cls.grade, subject: cls.subject, section: cls.section });
    navigate(`/classes/${cls.id}`);
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
          <p className="text-slate-500 mt-0.5">{classes.length} class{classes.length !== 1 ? 'es' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm">
          <Plus size={16} /> New Class
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-5">Create New Class</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { label: 'Class Name', key: 'name', placeholder: 'e.g. 5A' },
                { label: 'Grade', key: 'grade', placeholder: 'e.g. 5' },
                { label: 'Section', key: 'section', placeholder: 'e.g. A' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input
                    type="text"
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={f.placeholder}
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select value={form.subject} onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Mathematics</option><option>Science</option><option>English</option><option>Social Studies</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
                  {creating ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
          <School size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No classes yet. Create your first class.</p>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Create Class</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls: any) => (
            <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
                  <p className="text-sm text-slate-500">Grade {cls.grade} · {cls.subject}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg"><School size={18} className="text-blue-600" /></div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center bg-slate-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-slate-900">{cls.students?.length ?? 0}</p>
                  <p className="text-xs text-slate-500">Students</p>
                </div>
                <div className="text-center bg-slate-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-slate-900">{cls.assessments?.length ?? 0}</p>
                  <p className="text-xs text-slate-500">Assessments</p>
                </div>
                <div className="text-center bg-slate-50 rounded-lg p-2">
                  <p className="text-lg font-bold text-slate-900">{cls.groups?.length ?? 0}</p>
                  <p className="text-xs text-slate-500">Groups</p>
                </div>
              </div>

              {cls.isDemo !== false && <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mb-3">DEMO DATA</p>}

              <div className="flex gap-2">
                <button onClick={() => handleOpen(cls)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-1">
                  Open Class <ArrowRight size={14} />
                </button>
                <Link to={`/assessments/new`} className="flex items-center justify-center px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                  <ClipboardList size={14} />
                </Link>
                <Link to={`/groups`} className="flex items-center justify-center px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                  <Grid3X3 size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
