import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { groupAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { Info, Users, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const typeConfig: Record<string, { bg: string; badge: string; label: string; emoji: string }> = {
  intervention: { bg: 'border-l-red-500', badge: 'bg-red-100 text-red-700', label: 'Needs Support', emoji: '🎯' },
  on_track: { bg: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700', label: 'On Track', emoji: '📚' },
  advanced: { bg: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-700', label: 'Advanced', emoji: '🚀' },
  mixed: { bg: 'border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-700', label: 'Mixed', emoji: '📊' },
};

function WhyModal({ group, onClose }: { group: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg"><Info size={18} className="text-blue-600" /></div>
          <h3 className="text-lg font-bold text-slate-900">Why This Group?</h3>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-slate-800 mb-2">{group.name}</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{group.whyExplanation}</p>
        </div>
        {group.recommendedAction && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Recommended Action</p>
            <p className="text-sm text-blue-800">{group.recommendedAction}</p>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xl font-bold text-slate-900">{group.members?.length ?? 0}</p>
            <p className="text-xs text-slate-500">Students</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xl font-bold text-slate-900">{Math.round(group.avgMasteryPct)}%</p>
            <p className="text-xs text-slate-500">Avg Mastery</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xl font-bold text-slate-900">{typeConfig[group.type]?.emoji}</p>
            <p className="text-xs text-slate-500">{typeConfig[group.type]?.label}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-full py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700">
          Close
        </button>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const currentClass = useClassStore((s) => s.currentClass);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [whyGroup, setWhyGroup] = useState<any>(null);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    if (!currentClass?.id) { setLoading(false); return; }
    groupAPI.listForClass(currentClass.id).then(r => setGroups(r.data)).finally(() => setLoading(false));
  }, [currentClass?.id]);

  const handleRecalculate = async () => {
    if (!currentClass?.id) return;
    setRecalculating(true);
    try {
      await groupAPI.recalculate(currentClass.id);
      const r = await groupAPI.listForClass(currentClass.id);
      setGroups(r.data);
      toast.success('Groups recalculated!');
    } catch {
      toast.error('Failed to recalculate groups');
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {whyGroup && <WhyModal group={whyGroup} onClose={() => setWhyGroup(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Learning Groups</h1>
          <p className="text-slate-500 mt-0.5">{currentClass?.name} · {groups.length} active groups</p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={recalculating}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
        >
          <RefreshCw size={14} className={recalculating ? 'animate-spin' : ''} />
          Recalculate Groups
        </button>
      </div>

      {/* Summary banner */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-6">
          {Object.entries(
            groups.reduce((acc: any, g: any) => {
              acc[g.type] = (acc[g.type] || 0) + (g.members?.length ?? 0);
              return acc;
            }, {})
          ).map(([type, count]) => (
            <div key={type} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${type === 'intervention' ? 'bg-red-500' : type === 'on_track' ? 'bg-blue-500' : type === 'advanced' ? 'bg-purple-500' : 'bg-yellow-500'}`}></span>
              <span className="text-sm font-medium text-slate-700">{typeConfig[type]?.label}: <strong>{count as number}</strong> students</span>
            </div>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-500 mb-3">No groups found. Complete an assessment to generate groups.</p>
          <Link to="/assessments/new">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">New Assessment</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group: any) => {
            const cfg = typeConfig[group.type] || typeConfig.mixed;
            const interventions = group.interventions ?? [];
            const latestIntervention = interventions[0];

            return (
              <div key={group.id} className={`bg-white rounded-xl shadow-sm border-l-4 border border-slate-100 ${cfg.bg} p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{cfg.emoji}</span>
                      <h3 className="font-bold text-slate-800">{group.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{cfg.label}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Users size={10} /> {group.members?.length ?? 0} students</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setWhyGroup(group)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 font-medium"
                  >
                    <Info size={12} />
                    WHY?
                  </button>
                </div>

                {group.primarySkillName && (
                  <div className="bg-slate-50 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs text-slate-500 font-medium">Primary Skill Gap</p>
                    <p className="text-sm font-semibold text-slate-800">{group.primarySkillName}</p>
                  </div>
                )}

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Average Mastery</span>
                    <span className="font-semibold">{Math.round(group.avgMasteryPct)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${group.avgMasteryPct >= 80 ? 'bg-green-500' : group.avgMasteryPct >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, group.avgMasteryPct)}%` }}
                    />
                  </div>
                </div>

                {latestIntervention && (
                  <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${latestIntervention.status === 'completed' ? 'bg-green-400' : latestIntervention.status === 'active' ? 'bg-blue-400' : 'bg-gray-300'}`}></span>
                    Last intervention: {latestIntervention.title} · {latestIntervention.status}
                  </div>
                )}

                <div className="flex gap-2">
                  <Link to={`/groups/${group.id}`} className="flex-1">
                    <button className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      group.type === 'intervention' ? 'bg-red-600 text-white hover:bg-red-700' :
                      group.type === 'advanced' ? 'bg-purple-600 text-white hover:bg-purple-700' :
                      'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      <Zap size={14} />
                      {group.type === 'intervention' ? 'Start Intervention' : group.type === 'advanced' ? 'Enrichment' : 'View Activities'}
                    </button>
                  </Link>
                  <Link to={`/groups/${group.id}`}>
                    <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
