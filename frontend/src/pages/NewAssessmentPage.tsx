import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI, classAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, Edit2, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SKILLS = ['Multiplication Facts', 'Division Facts', 'Place Value', 'Addition/Subtraction Regrouping', 'Multi-digit Multiplication', 'Basic Division'];
const TYPES = ['diagnostic', 'weekly', 'quickcheck'];
const DIFFICULTIES = ['easy', 'mixed', 'hard'];

export default function NewAssessmentPage() {
  const navigate = useNavigate();
  const currentClass = useClassStore(s => s.currentClass);
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    classId: currentClass?.id || '',
    title: 'Beginning of Year Diagnostic',
    type: 'diagnostic',
    skill: 'Multiplication Facts',
    questionCount: 5,
    durationMinutes: 30,
    difficulty: 'mixed',
    language: 'English',
    topicId: '',
  });
  const [assessmentId, setAssessmentId] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    if (currentClass?.id) {
      classAPI.getTopics(currentClass.id).then(r => {
        const allTopics = r.data.flatMap((s: any) => s.topics || []);
        setTopics(allTopics);
        if (allTopics.length > 0) setConfig(p => ({ ...p, topicId: allTopics[0].id }));
      }).catch(() => {});
    }
  }, [currentClass?.id]);

  const handleStep1Next = async () => {
    if (!config.classId) { toast.error('Select a class'); return; }
    setCreating(true);
    try {
      const res = await assessmentAPI.create({
        title: config.title,
        classId: config.classId,
        topicId: config.topicId || topics[0]?.id || 'unknown',
        type: config.type,
        durationMinutes: config.durationMinutes,
        difficulty: config.difficulty,
        language: config.language,
        status: 'draft',
      });
      setAssessmentId(res.data.id);
      setStep(2);
      await handleGenerateQuestions(res.data.id);
    } catch {
      toast.error('Failed to create assessment');
    } finally {
      setCreating(false);
    }
  };

  const handleGenerateQuestions = async (aId?: string) => {
    const id = aId || assessmentId;
    if (!id) return;
    setGenerating(true);
    try {
      const res = await assessmentAPI.generateQuestions(id, {
        count: config.questionCount,
        skill: config.skill,
        difficulty: config.difficulty,
      });
      setQuestions(res.data.questions || []);
      toast.success('Questions generated!');
    } catch {
      toast.error('Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  };

  const handleApproveAll = async () => {
    try {
      await Promise.all(questions.map(q => assessmentAPI.approveQuestion(assessmentId, q.id)));
      await assessmentAPI.publish(assessmentId);
      toast.success('Assessment approved and published!');
      setStep(3);
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleDeleteQuestion = (qid: string) => {
    setQuestions(prev => prev.filter(q => q.id !== qid));
  };

  const steps = ['Configure', 'Review Questions', 'Choose Delivery'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20} /></button>
        <h1 className="text-2xl font-bold text-slate-900">New Assessment</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-2 ${i + 1 === step ? 'text-blue-600' : i + 1 < step ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 === step ? 'bg-blue-600 text-white' : i + 1 < step ? 'bg-green-100 text-green-600' : 'bg-slate-100'}`}>
                {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i + 1 < step ? 'bg-green-300' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h2 className="font-bold text-slate-800">Configure Assessment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Title</label>
              <input value={config.title} onChange={e => setConfig(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Type</label>
              <select value={config.type} onChange={e => setConfig(p => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Skill / Topic</label>
              <select value={config.skill} onChange={e => setConfig(p => ({ ...p, skill: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {SKILLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
              <input type="number" min={1} max={20} value={config.questionCount} onChange={e => setConfig(p => ({ ...p, questionCount: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
              <input type="number" min={5} max={120} value={config.durationMinutes} onChange={e => setConfig(p => ({ ...p, durationMinutes: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
              <select value={config.difficulty} onChange={e => setConfig(p => ({ ...p, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleStep1Next} disabled={creating || !config.classId}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
            {creating ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <>Next: Generate Questions <ChevronRight size={16} /></>}
          </button>
          {!config.classId && <p className="text-xs text-red-500">⚠️ No class selected. Go to Classes and open a class first.</p>}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Review Questions</h2>
            <div className="flex gap-2">
              <button onClick={() => handleGenerateQuestions()} disabled={generating} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
                <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
                {generating ? 'Generating...' : 'Regenerate All'}
              </button>
              <button onClick={handleApproveAll} disabled={questions.length === 0} className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
                <CheckCircle size={14} /> Approve & Publish
              </button>
            </div>
          </div>

          {generating ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
              <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Generating questions...</p>
              <p className="text-xs text-slate-400 mt-1">AI is creating skill-tagged questions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q: any, i: number) => (
                <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{q.text}</p>
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {['A', 'B', 'C', 'D'].map(opt => (
                            <div key={opt} className={`text-xs px-2 py-1 rounded ${q.correctAnswer === opt ? 'bg-green-100 text-green-700 font-semibold' : 'bg-slate-50 text-slate-600'}`}>
                              {opt}. {q[`option${opt}`]}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">Skill: {config.skill}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{q.difficulty}</span>
                          <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full">AI Generated</span>
                        </div>
                        {q.explanation && (
                          <p className="text-xs text-slate-500 mt-2 italic">💡 {q.explanation}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h2 className="font-bold text-slate-800 mb-1">Assessment Published! ✓</h2>
            <p className="text-sm text-slate-500">Choose how to deliver this assessment.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📱', title: 'A. Digital Assessment', desc: 'Students join via class code or QR code on their devices.', action: () => navigate(`/assessments/${assessmentId}/deliver/digital`), primary: true },
              { icon: '📄', title: 'B. OMR / Paper', desc: 'Print question paper and OMR sheet. Scan after test.', action: () => toast.success('OMR download would start here. For demo, use manual entry.'), primary: false },
              { icon: '✏️', title: 'C. Manual Entry', desc: 'Enter student answers manually after the test.', action: () => navigate(`/assessments/${assessmentId}`), primary: false },
            ].map((mode) => (
              <div key={mode.title} className={`bg-white rounded-xl border p-5 cursor-pointer hover:border-blue-300 transition-colors ${mode.primary ? 'border-blue-200 bg-blue-50' : 'border-slate-200'}`} onClick={mode.action}>
                <div className="text-3xl mb-3">{mode.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{mode.title}</h3>
                <p className="text-sm text-slate-500">{mode.desc}</p>
                <button className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold ${mode.primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
