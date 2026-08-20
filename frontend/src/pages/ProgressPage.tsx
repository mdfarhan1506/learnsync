import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ProgressPage() {
  const currentClass = useClassStore(s => s.currentClass);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'students' | 'skills'>('overview');

  useEffect(() => {
    if (!currentClass?.id) { setLoading(false); return; }
    progressAPI.forClass(currentClass.id).then(r => setProgress(r.data)).finally(() => setLoading(false));
  }, [currentClass?.id]);

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  const summary = progress?.summary ?? { total: 0, mastered: 0, developing: 0, needsSupport: 0 };
  const skillSummary = progress?.skillSummary ?? [];
  const interventionHistory = progress?.interventionHistory ?? [];
  const studentSummary = progress?.studentSummary ?? [];

  const skillChartData = skillSummary.map((s: any) => ({
    name: s.skillName.length > 18 ? s.skillName.slice(0, 18) + '…' : s.skillName,
    fullName: s.skillName,
    Mastered: s.mastered,
    Developing: s.developing,
    'Needs Support': s.needs_support,
    'Avg Mastery': Math.round(s.avgMastery),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Progress</h1>
        <p className="text-slate-500 mt-0.5 flex items-center gap-2">
          {currentClass?.name} · {currentClass?.subject}
          <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full font-medium">DEMO DATA</span>
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: summary.total, icon: Users, color: 'blue' },
          { label: 'Mastered / Advanced', value: summary.mastered, icon: CheckCircle, color: 'green' },
          { label: 'Developing', value: summary.developing, icon: TrendingUp, color: 'yellow' },
          { label: 'Needs Support', value: summary.needsSupport, icon: AlertTriangle, color: 'red' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className={`p-2.5 rounded-lg bg-${s.color}-50`}><Icon size={20} className={`text-${s.color}-600`} /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg max-w-xs">
        {(['overview', 'students', 'skills'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Skill mastery bar chart */}
          {skillChartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h2 className="font-bold text-slate-800 mb-4">Skill Mastery Distribution</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={skillChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any, name: string, props: any) => [value + ' students', name]}
                    labelFormatter={(label: string, payload: any[]) => payload[0]?.payload?.fullName || label}
                  />
                  <Legend />
                  <Bar dataKey="Mastered" fill="#16a34a" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Developing" fill="#d97706" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Needs Support" fill="#dc2626" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Average mastery line chart */}
          {skillChartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h2 className="font-bold text-slate-800 mb-4">Average Mastery by Skill (%)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={skillChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: any) => [v + '%', 'Avg Mastery']} />
                  <Bar dataKey="Avg Mastery" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Intervention history */}
          {interventionHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800">Intervention History</h2>
              </div>
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Group</th>
                    <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Skill</th>
                    <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Quick Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {interventionHistory.map((i: any) => (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <td className="p-3 text-sm text-slate-600">{new Date(i.date).toLocaleDateString()}</td>
                      <td className="p-3 text-sm font-medium text-slate-800">{i.groupName}</td>
                      <td className="p-3 text-sm text-slate-600">{i.skillName}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="flex gap-2 text-xs">
                          <span className="text-green-600">✓ {i.quickCheckSummary?.mastered}</span>
                          <span className="text-yellow-600">~ {i.quickCheckSummary?.developing}</span>
                          <span className="text-red-600">✗ {i.quickCheckSummary?.needs_support}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Students Tab */}
      {tab === 'students' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Student</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Skills Mastered</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Developing</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentSummary.map((s: any) => {
                const mastered = s.skills.filter((sk: any) => sk.status === 'mastered').length;
                const developing = s.skills.filter((sk: any) => sk.status === 'developing').length;
                const needs = s.skills.filter((sk: any) => sk.status === 'needs_support').length;
                const statusColor = s.overallStatus === 'mastered' || s.overallStatus === 'advanced' ? 'text-green-600 bg-green-50' : s.overallStatus === 'developing' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 text-sm font-medium text-slate-800">{s.name}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor}`}>{s.overallStatus?.replace('_', ' ')}</span></td>
                    <td className="p-3 text-sm text-green-600 hidden sm:table-cell">{mastered}</td>
                    <td className="p-3 text-sm text-yellow-600 hidden md:table-cell">{developing}</td>
                    <td className="p-3">
                      <Link to={`/students/${s.id}`}><button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><ArrowRight size={14} /></button></Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Skills Tab */}
      {tab === 'skills' && (
        <div className="space-y-3">
          {skillSummary.map((skill: any) => (
            <div key={skill.skillId} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">{skill.skillName}</h3>
                <span className="text-sm font-bold text-slate-700">{Math.round(skill.avgMastery)}% avg</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
                <div className={`h-3 rounded-full ${skill.avgMastery >= 80 ? 'bg-green-500' : skill.avgMastery >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, skill.avgMastery)}%` }} />
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 font-medium">✓ {skill.mastered} mastered</span>
                <span className="text-yellow-600 font-medium">~ {skill.developing} developing</span>
                <span className="text-red-600 font-medium">✗ {skill.needs_support} need support</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
