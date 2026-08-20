import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { groupAPI, quickCheckAPI } from '../services/api';
import { Info, Users, Zap, ChevronDown, ChevronUp, Play, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    mastered: 'bg-green-100 text-green-700 border-green-200',
    developing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    needs_support: 'bg-red-100 text-red-700 border-red-200',
    advanced: 'bg-purple-100 text-purple-700 border-purple-200',
  };
  const labels: Record<string, string> = { mastered: 'Mastered', developing: 'Developing', needs_support: 'Needs Support', advanced: 'Advanced' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${map[s] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{labels[s] || s}</span>;
};

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showOtherActivities, setShowOtherActivities] = useState(false);
  const [showWhyBox, setShowWhyBox] = useState(true);

  const fetchGroup = () => {
    if (!id) return;
    setLoading(true);
    groupAPI.get(id).then(r => setGroup(r.data)).catch(() => toast.error('Failed to load group')).finally(() => setLoading(false));
  };

  useEffect(fetchGroup, [id]);

  const latestIntervention = group?.interventions?.[0];
  const mainActivity = latestIntervention?.activities?.find((a: any) => a.targetGroup === 'intervention');
  const otherActivities = latestIntervention?.activities?.filter((a: any) => a.targetGroup !== 'intervention') ?? [];

  const handleGenerateIntervention = async () => {
    setGenerating(true);
    try {
      await groupAPI.generateIntervention(id!, { durationMins: 10 });
      toast.success('Intervention generated!');
      fetchGroup();
    } catch {
      toast.error('Failed to generate intervention');
    } finally {
      setGenerating(false);
    }
  };

  const handleStart = async () => {
    if (!latestIntervention) return;
    setStarting(true);
    try {
      await groupAPI.startIntervention(id!, latestIntervention.id);
      toast.success('Intervention started!');
      fetchGroup();
      navigate(`/groups/${id}/intervention`);
    } catch {
      toast.error('Failed to start');
    } finally {
      setStarting(false);
    }
  };

  const handleComplete = async () => {
    if (!latestIntervention) return;
    setCompleting(true);
    try {
      await groupAPI.completeIntervention(id!, latestIntervention.id);
      toast.success('Activity completed!');
      if (confirm('Would you like to run a Quick Check now?')) {
        navigate(`/groups/${id}/quick-check`);
      } else {
        fetchGroup();
      }
    } catch {
      toast.error('Failed to complete');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!group) return <div className="text-center py-16 text-slate-500">Group not found</div>;

  const steps = mainActivity ? JSON.parse(mainActivity.steps || '[]') : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg">←</button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{group.name}</h1>
          <p className="text-slate-500 text-sm">{group.members?.length} students · {group.primarySkillName && `Primary gap: ${group.primarySkillName}`}</p>
        </div>
      </div>

      {/* WHY THIS GROUP? — always visible */}
      <div className={`bg-blue-50 border border-blue-200 rounded-xl p-4 ${showWhyBox ? '' : 'cursor-pointer'}`}>
        <button onClick={() => setShowWhyBox(!showWhyBox)} className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-blue-600" />
            <span className="font-bold text-blue-900">WHY THIS GROUP?</span>
          </div>
          {showWhyBox ? <ChevronUp size={16} className="text-blue-500" /> : <ChevronDown size={16} className="text-blue-500" />}
        </button>
        {showWhyBox && (
          <div className="mt-3 space-y-2">
            <p className="text-blue-800 text-sm leading-relaxed">{group.whyExplanation}</p>
            {group.recommendedAction && (
              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-blue-200">
                <span className="text-blue-500 text-xs font-bold uppercase">Next Action:</span>
                <p className="text-blue-700 text-sm">{group.recommendedAction}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Users size={16} /> Students ({group.members?.length})
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {group.members?.map((m: any) => {
              const skillStatus = m.student?.profile?.skills?.find((ps: any) =>
                ps.skill?.name === group.primarySkillName
              );
              return (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.student.name}</p>
                    <p className="text-xs text-slate-400">Roll: {m.student.rollNumber}</p>
                  </div>
                  <div className="text-right">
                    {skillStatus && statusBadge(skillStatus.status)}
                    {skillStatus && <p className="text-xs text-slate-400 mt-0.5">{Math.round(skillStatus.masteryPct)}%</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Intervention Panel */}
        <div className="lg:col-span-2 space-y-4">
          {!latestIntervention ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
              <Zap size={32} className="text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 mb-2">No intervention yet</h3>
              <p className="text-slate-500 text-sm mb-4">Generate a targeted classroom intervention for this group.</p>
              <button
                onClick={handleGenerateIntervention}
                disabled={generating}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {generating ? '⏳ Generating...' : '⚡ Generate Intervention'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Intervention header */}
              <div className={`p-4 border-b ${latestIntervention.status === 'completed' ? 'bg-green-50 border-green-100' : latestIntervention.status === 'active' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{latestIntervention.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Duration: {latestIntervention.durationMins} min ·
                      Status: <span className="capitalize font-medium">{latestIntervention.status}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${latestIntervention.status === 'completed' ? 'bg-green-100 text-green-700' : latestIntervention.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {latestIntervention.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {mainActivity && (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Objective</p>
                    <p className="text-sm text-slate-700">{mainActivity.objective}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Materials</p>
                    <p className="text-sm text-slate-700">{mainActivity.materials}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Steps</p>
                    <div className="space-y-2">
                      {steps.map((step: string, i: number) => (
                        <div key={i} className="flex gap-3 p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-xs font-bold text-blue-600 mt-0.5 shrink-0">{i + 1}</span>
                          <p className="text-sm text-slate-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {mainActivity.examples && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Examples</p>
                      <p className="text-sm text-slate-600 italic">{mainActivity.examples}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="p-4 border-t border-slate-100 flex gap-3 flex-wrap">
                {latestIntervention.status === 'planned' && (
                  <button onClick={handleStart} disabled={starting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
                    <Play size={16} /> {starting ? 'Starting...' : 'Start Activity'}
                  </button>
                )}
                {latestIntervention.status === 'active' && (
                  <button onClick={handleComplete} disabled={completing} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60">
                    <CheckCircle size={16} /> {completing ? 'Completing...' : 'Complete Activity'}
                  </button>
                )}
                {latestIntervention.status === 'completed' && (
                  <Link to={`/groups/${id}/quick-check`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
                      <ArrowRight size={16} /> Run Quick Check
                    </button>
                  </Link>
                )}
                <button onClick={handleGenerateIntervention} disabled={generating} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-sm">
                  {generating ? 'Generating...' : '↻ Regenerate'}
                </button>
              </div>
            </div>
          )}

          {/* Other group activities */}
          {otherActivities.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <button
                onClick={() => setShowOtherActivities(!showOtherActivities)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50"
              >
                <h3 className="font-bold text-slate-800">Other Group Activities ({otherActivities.length})</h3>
                {showOtherActivities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showOtherActivities && (
                <div className="divide-y divide-slate-100">
                  {otherActivities.map((act: any, i: number) => {
                    const actSteps = JSON.parse(act.steps || '[]');
                    const typeLabel = act.targetGroup === 'advanced' ? '🚀 Advanced' : act.targetGroup === 'on_track' ? '📚 On Track' : '📝 Practice';
                    return (
                      <div key={i} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{typeLabel}</span>
                          <h4 className="font-semibold text-slate-800 text-sm">{act.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{act.objective}</p>
                        <div className="space-y-1">
                          {actSteps.slice(0, 3).map((step: string, si: number) => (
                            <p key={si} className="text-xs text-slate-500">• {step}</p>
                          ))}
                          {actSteps.length > 3 && <p className="text-xs text-slate-400">+{actSteps.length - 3} more steps</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
