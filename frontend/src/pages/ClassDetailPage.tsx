import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { classAPI, studentAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { Users, ClipboardList, Grid3X3, ArrowRight, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  mastered: 'text-green-600 bg-green-50',
  developing: 'text-yellow-600 bg-yellow-50',
  needs_support: 'text-red-600 bg-red-50',
  advanced: 'text-purple-600 bg-purple-50',
  unknown: 'text-gray-500 bg-gray-50',
};

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setCurrentClass = useClassStore(s => s.setCurrentClass);
  const [cls, setCls] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'students' | 'assessments' | 'groups'>('overview');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '' });
  const [adding, setAdding] = useState(false);

  const fetchClass = () => {
    if (!id) return;
    classAPI.get(id).then(r => {
      setCls(r.data);
      setCurrentClass({ id: r.data.id, name: r.data.name, grade: r.data.grade, subject: r.data.subject, section: r.data.section });
    }).finally(() => setLoading(false));
  };
  useEffect(fetchClass, [id]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await studentAPI.create({ ...newStudent, classId: id });
      toast.success('Student added!');
      setShowAddStudent(false);
      setNewStudent({ name: '', rollNumber: '' });
      fetchClass();
    } catch {
      toast.error('Failed to add student');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!cls) return <div className="text-center py-16 text-slate-500">Class not found</div>;

  const tabs = ['overview', 'students', 'assessments', 'groups'] as const;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Class {cls.name}</h1>
            <p className="text-slate-500">Grade {cls.grade} · {cls.subject} · Section {cls.section} · {cls.academicYear}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/assessments/new">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <ClipboardList size={14} /> New Assessment
              </button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center bg-slate-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-slate-900">{cls.students?.length ?? 0}</p>
            <p className="text-xs text-slate-500">Students</p>
          </div>
          <div className="text-center bg-slate-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-slate-900">{cls.assessments?.length ?? 0}</p>
            <p className="text-xs text-slate-500">Assessments</p>
          </div>
          <div className="text-center bg-slate-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-slate-900">{cls.groups?.length ?? 0}</p>
            <p className="text-xs text-slate-500">Active Groups</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Students', icon: Users, link: '', count: cls.students?.length, onClick: () => setTab('students'), color: 'blue' },
            { title: 'Assessments', icon: ClipboardList, link: '/assessments', count: cls.assessments?.length, onClick: () => setTab('assessments'), color: 'green' },
            { title: 'Learning Groups', icon: Grid3X3, link: '/groups', count: cls.groups?.length, onClick: () => setTab('groups'), color: 'purple' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} onClick={item.onClick} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 cursor-pointer hover:border-blue-200 transition-colors">
                <div className={`p-2 rounded-lg bg-${item.color}-50 w-fit mb-3`}>
                  <Icon size={20} className={`text-${item.color}-600`} />
                </div>
                <p className="text-3xl font-black text-slate-900">{item.count ?? 0}</p>
                <p className="text-sm text-slate-500">{item.title}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Students Tab */}
      {tab === 'students' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {showAddStudent && (
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <form onSubmit={handleAddStudent} className="flex gap-2">
                <input value={newStudent.rollNumber} onChange={e => setNewStudent(p => ({ ...p, rollNumber: e.target.value }))}
                  placeholder="Roll No" className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" required />
                <input value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))}
                  placeholder="Student Name" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none" required />
                <button type="submit" disabled={adding} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Add</button>
                <button type="button" onClick={() => setShowAddStudent(false)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm">Cancel</button>
              </form>
            </div>
          )}
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Students ({cls.students?.length})</h3>
            <button onClick={() => setShowAddStudent(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium">
              <UserPlus size={12} /> Add Student
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Roll No</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Status</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Primary Gap</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cls.students?.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3 text-sm text-slate-600 font-mono">{s.rollNumber}</td>
                  <td className="p-3">
                    <p className="text-sm font-medium text-slate-800">{s.name}</p>
                    {s.isDemo && <span className="text-xs text-amber-500">demo</span>}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {s.profile ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[s.profile.overallStatus]}`}>
                        {s.profile.overallStatus.replace('_', ' ')}
                      </span>
                    ) : <span className="text-xs text-slate-400">No data</span>}
                  </td>
                  <td className="p-3 text-xs text-slate-500 hidden md:table-cell">{s.profile?.primaryGap || '—'}</td>
                  <td className="p-3">
                    <Link to={`/students/${s.id}`}>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><ArrowRight size={14} /></button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assessments Tab */}
      {tab === 'assessments' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Link to="/assessments/new">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">+ New Assessment</button>
            </Link>
          </div>
          {cls.assessments?.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No assessments yet.</div>
          ) : (
            cls.assessments?.map((a: any) => (
              <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800">{a.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{a.type} · {new Date(a.createdAt).toLocaleDateString()} · Status: {a.status}</p>
                </div>
                <Link to={`/assessments/${a.id}`}>
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ArrowRight size={14} /></button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Groups Tab */}
      {tab === 'groups' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Link to="/groups">
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50">View All Groups</button>
            </Link>
          </div>
          {cls.groups?.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No groups yet. Complete an assessment first.</div>
          ) : (
            cls.groups?.map((g: any) => (
              <div key={g.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800">{g.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{g.members?.length ?? 0} students · {g.type}</p>
                </div>
                <Link to={`/groups/${g.id}`}>
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ArrowRight size={14} /></button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
