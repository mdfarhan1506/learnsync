import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import { ChevronLeft, BarChart2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
  review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Review' },
  published: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Published' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
};

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'questions'>('overview');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!id) return;
    assessmentAPI.get(id).then(r => setAssessment(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await assessmentAPI.publish(id!);
      toast.success('Assessment published!');
      setAssessment((prev: any) => ({ ...prev, status: 'published' }));
    } catch { toast.error('Failed to publish'); }
    finally { setPublishing(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!assessment) return <div className="text-center py-16 text-slate-500">Assessment not found</div>;

  const sc = statusConfig[assessment.status] || statusConfig.draft;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{assessment.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}>{sc.label}</span>
            <span className="text-xs text-slate-500">{assessment.type} · {assessment.questions?.length ?? 0} questions</span>
          </div>
        </div>
        <div className="flex gap-2">
          {assessment.status === 'completed' && (
            <Link to={`/assessments/${id}/results`}>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                <BarChart2 size={14} /> Results
              </button>
            </Link>
          )}
          {(assessment.status === 'draft' || assessment.status === 'review') && (
            <button onClick={handlePublish} disabled={publishing} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60">
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          )}
          {assessment.status === 'published' && (
            <Link to={`/assessments/${id}/deliver/digital`}>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Deliver →</button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg max-w-xs">
        {(['overview', 'questions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Duration', value: `${assessment.durationMinutes} min` },
              { label: 'Class Code', value: assessment.classCode },
              { label: 'Difficulty', value: assessment.difficulty },
              { label: 'Language', value: assessment.language },
              { label: 'Submissions', value: assessment.submissions?.length ?? 0 },
              { label: 'Created', value: new Date(assessment.createdAt).toLocaleDateString() },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5 font-mono">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'questions' && (
        <div className="space-y-3">
          {assessment.questions?.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No questions yet.</div>
          ) : (
            assessment.questions?.map((q: any, i: number) => (
              <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-blue-100 text-blue-600 text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{q.text}</p>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <div key={opt} className={`text-xs px-2 py-1 rounded ${q.correctAnswer === opt ? 'bg-green-100 text-green-700 font-semibold' : 'bg-slate-50 text-slate-600'}`}>
                          {opt}. {q[`option${opt}`]}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{q.difficulty}</span>
                      {q.isApproved && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Approved</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
