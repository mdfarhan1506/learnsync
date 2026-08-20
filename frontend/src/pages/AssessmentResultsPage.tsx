import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, Users, TrendingUp } from 'lucide-react';

export default function AssessmentResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    assessmentAPI.getAnalysis(id).then(r => setData(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!data) return <div className="text-center py-16 text-slate-500">No results found</div>;

  const chartData = data.skillBreakdown?.map((s: any) => ({
    name: s.skillName.length > 15 ? s.skillName.slice(0, 15) + '…' : s.skillName,
    fullName: s.skillName,
    Mastered: s.mastered,
    Developing: s.developing,
    'Needs Support': s.needs_support,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assessment Results</h1>
          <p className="text-slate-500 text-sm">{data.assessment?.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-slate-900">{data.totalStudents}</p>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1"><Users size={12} /> Submitted</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
          <p className="text-3xl font-black text-blue-600">{Math.round(data.avgScore)}%</p>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1"><TrendingUp size={12} /> Avg Score</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center col-span-2 sm:col-span-1">
          <p className="text-3xl font-black text-slate-900">{data.skillBreakdown?.length}</p>
          <p className="text-xs text-slate-500 mt-1">Skills Assessed</p>
        </div>
      </div>

      {chartData?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-800 mb-4">Skill Breakdown</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label} />
              <Bar dataKey="Mastered" fill="#16a34a" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Developing" fill="#d97706" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Needs Support" fill="#dc2626" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Skill Mastery Summary</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Skill</th>
              <th className="text-right p-3 text-xs font-semibold text-green-600 uppercase">Mastered</th>
              <th className="text-right p-3 text-xs font-semibold text-yellow-600 uppercase">Developing</th>
              <th className="text-right p-3 text-xs font-semibold text-red-600 uppercase">Needs Support</th>
              <th className="text-right p-3 text-xs font-semibold text-slate-500 uppercase">Avg %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.skillBreakdown?.map((s: any) => (
              <tr key={s.skillId} className="hover:bg-slate-50">
                <td className="p-3 text-sm font-medium text-slate-800">{s.skillName}</td>
                <td className="p-3 text-sm text-right text-green-600 font-semibold">{s.mastered}</td>
                <td className="p-3 text-sm text-right text-yellow-600 font-semibold">{s.developing}</td>
                <td className="p-3 text-sm text-right text-red-600 font-semibold">{s.needs_support}</td>
                <td className="p-3 text-sm text-right font-bold text-slate-800">{Math.round(s.avgMastery)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Student Results</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Roll No</th>
              <th className="text-right p-3 text-xs font-semibold text-slate-500 uppercase">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.submissions?.map((s: any) => (
              <tr key={s.studentId} className="hover:bg-slate-50">
                <td className="p-3 text-sm font-medium text-slate-800">{s.studentName}</td>
                <td className="p-3 text-sm text-slate-500 hidden sm:table-cell font-mono">{s.rollNumber}</td>
                <td className="p-3 text-right">
                  <span className={`text-sm font-bold ${s.percentScore >= 80 ? 'text-green-600' : s.percentScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {Math.round(s.percentScore)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <Link to="/groups">
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">View Learning Groups →</button>
        </Link>
      </div>
    </div>
  );
}
