import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import { ChevronLeft, Monitor, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DigitalDeliveryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    assessmentAPI.get(id).then(r => setAssessment(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!studentId) { toast.error('Select a student'); return; }
    setSubmitting(true);
    try {
      const answers = assessment.questions.map((q: any) => ({
        questionId: q.id,
        selectedAnswer: studentAnswers[q.id] || '',
        correctAnswer: q.correctAnswer,
      }));
      await assessmentAPI.submitResults(id!, { studentId, answers });
      toast.success('Results submitted!');
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!assessment) return <div className="text-center py-16 text-slate-500">Assessment not found</div>;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Results Submitted!</h2>
        <p className="text-slate-500 mb-6">Student's answers have been recorded.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setStudentAnswers({}); setStudentId(''); setStudentName(''); }} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Submit Another</button>
          <button onClick={() => navigate(`/assessments/${id}/results`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">View Results →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20} /></button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{assessment.title}</h1>
          <p className="text-slate-500 text-sm">Code: <code className="font-mono text-blue-600">{assessment.classCode}</code> · {assessment.questions?.length} questions</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
        <span className="text-amber-500 text-sm">⚠️</span>
        <p className="text-amber-700 text-sm font-medium">DEMO MODE — You are entering answers manually on behalf of a student. In production, students would answer on their own devices.</p>
      </div>

      {/* Student selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="font-bold text-slate-800 mb-3">Select Student</h2>
        <select value={studentId} onChange={e => setStudentId(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="">-- Select a student --</option>
          {assessment.submissions?.map ? (
            <option value="demo-student-1">Aarav Sharma (Roll: 01)</option>
          ) : null}
          <option value="demo-student-1">Demo: Aarav Sharma</option>
          <option value="demo-student-2">Demo: Neha Gupta</option>
          <option value="demo-student-3">Demo: Rohan Patel</option>
        </select>
        <p className="text-xs text-slate-400 mt-2">In production, students log in or scan QR code to access the assessment.</p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {assessment.questions?.map((q: any, i: number) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex gap-3 mb-3">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 text-xs font-bold rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
              <p className="font-medium text-slate-800">{q.text}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['A', 'B', 'C', 'D'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setStudentAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${studentAnswers[q.id] === opt ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold' : 'border-slate-200 text-slate-700 hover:border-blue-300'}`}
                >
                  <span className="font-bold mr-2">{opt}.</span>{q[`option${opt}`]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting || !studentId || Object.keys(studentAnswers).length < (assessment.questions?.length || 0)}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Answers →'}
      </button>
    </div>
  );
}
