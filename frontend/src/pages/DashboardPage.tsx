import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Grid3X3, ClipboardList, AlertTriangle, ArrowRight, TrendingUp, BookOpen, Zap } from 'lucide-react';
import { groupAPI, progressAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { useAuthStore } from '../stores/authStore';

const statusColors: Record<string, string> = {
  intervention: 'bg-red-50 border-red-200 text-red-700',
  on_track: 'bg-blue-50 border-blue-200 text-blue-700',
  advanced: 'bg-purple-50 border-purple-200 text-purple-700',
  mixed: 'bg-yellow-50 border-yellow-200 text-yellow-700',
};

const statusLabels: Record<string, string> = {
  intervention: 'Needs Support',
  on_track: 'On Track',
  advanced: 'Advanced',
  mixed: 'Mixed',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {statusLabels[status] || status}
    </span>
  );
}

function MasteryBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  const currentClass = useClassStore((s) => s.currentClass);
  const user = useAuthStore((s) => s.user);
  const [groups, setGroups] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    if (!currentClass?.id) { setLoading(false); return; }
    Promise.all([
      groupAPI.listForClass(currentClass.id).then(r => setGroups(r.data)),
      progressAPI.forClass(currentClass.id).then(r => setProgress(r.data)),
    ]).finally(() => setLoading(false));
  }, [currentClass?.id]);

  const skillSummary = progress?.skillSummary ?? [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-0.5">
            {currentClass ? `${currentClass.name} · Grade ${currentClass.grade} ${currentClass.subject}` : 'No class selected'}
          </p>
        </div>
        <Link to="/assessments/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            <ClipboardList size={16} />
            New Assessment
          </button>
        </Link>
      </div>

      {/* Demo notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
        <span className="text-amber-600 text-sm font-medium">⚠️ DEMO DATA</span>
        <span className="text-amber-700 text-sm">— All student data is fictional and for demonstration purposes only.</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: progress?.summary?.total ?? 40, icon: Users, color: 'blue' },
          { label: 'Active Groups', value: groups.length, icon: Grid3X3, color: 'purple' },
          { label: 'Needing Support', value: progress?.summary?.needsSupport ?? 15, icon: AlertTriangle, color: 'red' },
          { label: 'On Track / Mastered', value: (progress?.summary?.mastered ?? 0) + (progress?.summary?.developing ?? 0), icon: TrendingUp, color: 'green' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className={`p-2.5 rounded-lg bg-${stat.color}-50`}>
                <Icon size={20} className={`text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Today's Classroom Plan</h2>
            <Link to="/groups" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View all groups <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : groups.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-slate-500">No groups yet. Create an assessment to generate learning groups.</p>
              <Link to="/assessments/new">
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">New Assessment</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groups.map((group: any) => (
                <div key={group.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-sm">{group.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{group.members?.length ?? 0} students</p>
                    </div>
                    <StatusBadge status={group.type} />
                  </div>

                  {group.primarySkillName && (
                    <p className="text-xs text-slate-600 mb-2 bg-slate-50 rounded px-2 py-1">
                      📚 {group.primarySkillName}
                    </p>
                  )}

                  <MasteryBar pct={group.avgMasteryPct} />
                  <p className="text-xs text-slate-500 mt-1">Avg mastery: {Math.round(group.avgMasteryPct)}%</p>

                  <Link to={`/groups/${group.id}`}>
                    <button className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      group.type === 'intervention'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : group.type === 'advanced'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      {group.type === 'intervention' ? '🎯 Start Intervention' : group.type === 'advanced' ? '🚀 Enrichment Activities' : '📖 View Activities'}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-700 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/assessments/new" className="flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-lg group transition-colors">
                <div className="p-1.5 bg-blue-100 rounded-lg"><ClipboardList size={14} className="text-blue-600" /></div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">New Assessment</span>
                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-blue-400" />
              </Link>
              <Link to="/groups" className="flex items-center gap-3 p-2.5 hover:bg-purple-50 rounded-lg group transition-colors">
                <div className="p-1.5 bg-purple-100 rounded-lg"><Grid3X3 size={14} className="text-purple-600" /></div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">View Groups</span>
                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-purple-400" />
              </Link>
              <Link to="/progress" className="flex items-center gap-3 p-2.5 hover:bg-green-50 rounded-lg group transition-colors">
                <div className="p-1.5 bg-green-100 rounded-lg"><TrendingUp size={14} className="text-green-600" /></div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-green-700">View Progress</span>
                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-green-400" />
              </Link>
              <Link to="/activities" className="flex items-center gap-3 p-2.5 hover:bg-amber-50 rounded-lg group transition-colors">
                <div className="p-1.5 bg-amber-100 rounded-lg"><BookOpen size={14} className="text-amber-600" /></div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-amber-700">Activities Library</span>
                <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-amber-400" />
              </Link>
            </div>
          </div>

          {/* Class Learning Map */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <h2 className="text-sm font-bold text-slate-700 mb-3">Class Learning Map</h2>
            {skillSummary.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Run an assessment to see skill data</p>
            ) : (
              <div className="space-y-3">
                {skillSummary.slice(0, 4).map((skill: any) => (
                  <div key={skill.skillId}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-600 truncate">{skill.skillName}</span>
                      <span className="text-xs text-slate-400">{Math.round(skill.avgMastery)}%</span>
                    </div>
                    <MasteryBar pct={skill.avgMastery} />
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-green-600">✓ {skill.mastered}</span>
                      <span className="text-xs text-yellow-600">~ {skill.developing}</span>
                      <span className="text-xs text-red-600">✗ {skill.needs_support}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
