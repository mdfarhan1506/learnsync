import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupAPI } from '../services/api';
import { ChevronLeft, Play, Pause, CheckCircle, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterventionPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    groupAPI.get(groupId).then(r => setGroup(r.data)).finally(() => setLoading(false));
  }, [groupId]);

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const latestIntervention = group?.interventions?.[0];
  const mainActivity = latestIntervention?.activities?.find((a: any) => a.targetGroup === 'intervention');
  const steps: string[] = mainActivity ? JSON.parse(mainActivity.steps || '[]') : [];
  const otherActivities = latestIntervention?.activities?.filter((a: any) => a.targetGroup !== 'intervention') ?? [];

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleComplete = async () => {
    if (!latestIntervention) return;
    setCompleting(true);
    setRunning(false);
    try {
      await groupAPI.completeIntervention(groupId!, latestIntervention.id);
      toast.success('Activity completed!');
      navigate(`/groups/${groupId}/quick-check`);
    } catch {
      toast.error('Failed to complete. Try again.');
      setCompleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!group || !latestIntervention || !mainActivity) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-slate-500 mb-4">No active intervention. Go back to the group and generate one first.</p>
        <button onClick={() => navigate(`/groups/${groupId}`)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Group</button>
      </div>
    );
  }

  const durationSecs = (latestIntervention.durationMins || 10) * 60;
  const progress = Math.min(100, (timer / durationSecs) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"><ChevronLeft size={20} /></button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{mainActivity.title}</h1>
          <p className="text-slate-500 text-sm">{group.name} · {group.members?.length} students</p>
        </div>
        {/* Timer */}
        <div className="flex items-center gap-3 bg-slate-800 text-white rounded-xl px-4 py-2">
          <Timer size={18} className="text-blue-400" />
          <span className="font-mono text-xl font-bold">{formatTime(timer)}</span>
          <button onClick={() => setRunning(r => !r)} className={`p-1.5 rounded-lg ${running ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-blue-500 hover:bg-blue-400'}`}>
            {running ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Time elapsed</span>
          <span>{Math.floor(timer / 60)} / {latestIntervention.durationMins} min</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
        </div>
        {progress >= 100 && <p className="text-xs text-green-600 mt-1 font-medium">⏱️ Time's up! Complete the activity and run a Quick Check.</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Steps panel */}
        <div className="lg:col-span-3 space-y-3">
          <h2 className="font-bold text-slate-800">Activity Steps</h2>
          {steps.map((step, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`rounded-xl p-4 cursor-pointer border-2 transition-all ${currentStep === i ? 'border-blue-500 bg-blue-50' : i < currentStep ? 'border-green-300 bg-green-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${currentStep === i ? 'bg-blue-600 text-white' : i < currentStep ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <p className={`text-sm leading-relaxed ${currentStep === i ? 'text-blue-900 font-medium' : i < currentStep ? 'text-green-800' : 'text-slate-700'}`}>
                  {step}
                </p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}
              className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-slate-50">
              ← Previous
            </button>
            <button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} disabled={currentStep === steps.length - 1}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-blue-700">
              Next →
            </button>
          </div>
        </div>

        {/* Side info */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Objective</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{mainActivity.objective}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-2">Materials Needed</h3>
            <p className="text-sm text-slate-600">{mainActivity.materials}</p>
          </div>
          {mainActivity.differentiation && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <h3 className="font-bold text-amber-800 text-sm mb-2">Differentiation</h3>
              <p className="text-sm text-amber-700">{mainActivity.differentiation}</p>
            </div>
          )}

          {otherActivities.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <h3 className="font-bold text-slate-700 text-sm mb-2">Other Groups Working On:</h3>
              {otherActivities.map((a: any, i: number) => (
                <div key={i} className="text-xs text-slate-600 py-1 border-b border-slate-100 last:border-0">
                  <span className="font-medium">{a.targetGroup === 'advanced' ? '🚀' : '📚'} {a.targetGroup}</span>: {a.title}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-60 text-sm"
          >
            <CheckCircle size={18} />
            {completing ? 'Completing...' : 'Activity Done — Run Quick Check →'}
          </button>
        </div>
      </div>
    </div>
  );
}
