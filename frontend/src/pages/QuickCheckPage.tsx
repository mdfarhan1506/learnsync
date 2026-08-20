import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupAPI, quickCheckAPI } from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, MinusCircle, ChevronLeft, Send } from 'lucide-react';

type StatusKey = 'mastered' | 'still_needs_practice' | 'needs_support' | '';

const STATUS_BUTTONS: { key: StatusKey; label: string; icon: any; active: string; idle: string }[] = [
  { key: 'mastered', label: '✓ MASTERED', icon: CheckCircle2, active: 'bg-green-600 text-white border-green-600', idle: 'bg-white text-green-700 border-green-300 hover:bg-green-50' },
  { key: 'still_needs_practice', label: '↔ STILL NEEDS PRACTICE', icon: MinusCircle, active: 'bg-yellow-500 text-white border-yellow-500', idle: 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50' },
  { key: 'needs_support', label: '✗ NEEDS SUPPORT', icon: XCircle, active: 'bg-red-600 text-white border-red-600', idle: 'bg-white text-red-700 border-red-300 hover:bg-red-50' },
];

export default function QuickCheckPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [statuses, setStatuses] = useState<Record<string, StatusKey>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (!groupId) return;
    groupAPI.get(groupId).then(r => setGroup(r.data));
  }, [groupId]);

  const latestIntervention = group?.interventions?.[0];
  const students = group?.members?.map((m: any) => m.student) ?? [];

  // Quick check questions (from intervention or default)
  const quickCheckQuestions = [
    { q: latestIntervention?.skill?.name === 'Division Facts' ? '56 ÷ 8 = ?' : '504 − 289 = ?' },
    { q: latestIntervention?.skill?.name === 'Division Facts' ? '45 ÷ 9 = ?' : '300 − 145 = ?' },
    { q: latestIntervention?.skill?.name === 'Division Facts' ? '64 ÷ 8 = ?' : '1,000 − 456 = ?' },
  ];

  const handleStatus = (studentId: string, status: StatusKey) => {
    setStatuses(prev => ({ ...prev, [studentId]: prev[studentId] === status ? '' : status }));
  };

  const allMarked = students.length > 0 && students.every((s: any) => statuses[s.id]);
  const markedCount = Object.values(statuses).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!latestIntervention) {
      toast.error('No active intervention found');
      return;
    }
    const results = students.map((s: any) => ({
      studentId: s.id,
      status: statuses[s.id] || 'needs_support',
    }));

    setSubmitting(true);
    try {
      const res = await quickCheckAPI.submit({
        interventionId: latestIntervention.id,
        results
      });
      setSummary(res.data.summary);
      setSubmitted(true);
      toast.success('Quick check results saved!');
    } catch {
      toast.error('Failed to save results');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && summary) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Learning Profiles Updated!</h2>
          <p className="text-slate-500 mb-6">Quick check results have been recorded and student profiles updated.</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-3xl font-black text-green-600">{summary.mastered}</p>
              <p className="text-sm text-green-700 font-medium">Mastered</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="text-3xl font-black text-yellow-600">{summary.developing}</p>
              <p className="text-sm text-yellow-700 font-medium">Developing</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-3xl font-black text-red-600">{summary.needsSupport}</p>
              <p className="text-sm text-red-700 font-medium">Needs Support</p>
            </div>
          </div>

          {summary.mastered > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-left">
              <p className="text-sm text-blue-800">
                🎉 <strong>{summary.mastered} student{summary.mastered > 1 ? 's' : ''}</strong> {summary.mastered > 1 ? 'are' : 'is'} ready for the next skill!
              </p>
            </div>
          )}
          {summary.needsSupport > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-left">
              <p className="text-sm text-red-800">
                ⚠️ <strong>{summary.needsSupport} student{summary.needsSupport > 1 ? 's' : ''}</strong> should continue with another targeted intervention.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => navigate('/groups')} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50">
              View Updated Groups
            </button>
            <button onClick={() => navigate('/progress')} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
              View Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quick Check</h1>
          <p className="text-slate-500 text-sm">{group?.name} · {group?.primarySkillName}</p>
        </div>
      </div>

      {/* Questions display */}
      <div className="bg-slate-800 text-white rounded-xl p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Ask these questions verbally:</p>
        <div className="space-y-2">
          {quickCheckQuestions.map((q, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-700 rounded-lg px-4 py-2.5">
              <span className="text-blue-400 font-bold text-sm mt-0.5">{i + 1}.</span>
              <p className="text-sm font-medium">{q.q}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 italic">Mark each student after they answer verbally, on paper, or on whiteboard.</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100">
        <p className="text-sm text-slate-600">{markedCount}/{students.length} students marked</p>
        <div className="w-48 bg-slate-100 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${students.length > 0 ? (markedCount / students.length) * 100 : 0}%` }}></div>
        </div>
      </div>

      {/* Student list */}
      <div className="space-y-3">
        {students.map((student: any) => {
          const current = statuses[student.id] || '';
          return (
            <div key={student.id} className={`bg-white rounded-xl shadow-sm border transition-colors ${current ? 'border-slate-200' : 'border-slate-100'} p-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="sm:w-48 shrink-0">
                  <p className="font-bold text-slate-900">{student.name}</p>
                  <p className="text-xs text-slate-400">Roll: {student.rollNumber}</p>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {STATUS_BUTTONS.map(btn => (
                    <button
                      key={btn.key}
                      onClick={() => handleStatus(student.id, btn.key)}
                      className={`flex-1 min-w-fit py-2.5 px-3 rounded-lg border-2 font-bold text-xs transition-all ${current === btn.key ? btn.active : btn.idle}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="sticky bottom-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || students.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
            allMarked
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
          {submitting ? 'Saving...' : allMarked ? 'Submit All Results' : `Mark all students to submit (${markedCount}/${students.length})`}
        </button>
      </div>
    </div>
  );
}
