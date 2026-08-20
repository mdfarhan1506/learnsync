import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { ClipboardList, Plus, ArrowRight, Eye } from 'lucide-react';

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
  review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Review' },
  published: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Published' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
};

export default function AssessmentsPage() {
  const currentClass = useClassStore(s => s.currentClass);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    assessmentAPI.list(currentClass?.id).then(r => setAssessments(r.data)).finally(() => setLoading(false));
  }, [currentClass?.id]);

  const filtered = filter === 'all' ? assessments : assessments.filter(a => a.status === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
          <p className="text-slate-500 mt-0.5">{assessments.length} total</p>
        </div>
        <Link to="/assessments/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm">
            <Plus size={16} /> New Assessment
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'draft', 'review', 'published', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {f === 'all' ? 'All' : statusConfig[f]?.label ?? f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No assessments yet. Create your first diagnostic assessment.</p>
          <Link to="/assessments/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">New Assessment</button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a: any) => {
            const sc = statusConfig[a.status] || statusConfig.draft;
            return (
              <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg"><ClipboardList size={18} className="text-blue-600" /></div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{a.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {a.type} · {new Date(a.createdAt).toLocaleDateString()} · {a.questions?.length ?? 0} questions
                        {a.submissions?.length > 0 && ` · ${a.submissions.length} submitted`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>{sc.label}</span>
                    <Link to={`/assessments/${a.id}`}>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
                {a.status === 'completed' && a.submissions?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-50 flex gap-4 text-xs text-slate-500">
                    <span>📊 {a.submissions.length} submissions</span>
                    <span>Code: <code className="font-mono text-blue-600">{a.classCode}</code></span>
                    <Link to={`/assessments/${a.id}/results`} className="text-blue-600 hover:underline flex items-center gap-1">
                      <Eye size={12} /> View Results
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
