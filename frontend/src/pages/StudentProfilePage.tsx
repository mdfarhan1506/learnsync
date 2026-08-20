import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { progressAPI, studentAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { ChevronLeft, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  mastered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Mastered' },
  developing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Developing' },
  needs_support: { bg: 'bg-red-100', text: 'text-red-700', label: 'Needs Support' },
  advanced: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Advanced' },
  unknown: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unknown' },
};

function StatusBadge({ status }: { status: string }) {
  const c = statusColors[status] || statusColors.unknown;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>{c.label}</span>;
}

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [obsText, setObsText] = useState('');
  const [savingObs, setSavingObs] = useState(false);

  const fetchStudent = () => {
    if (!id) return;
    progressAPI.forStudent(id).then(r => setStudent(r.data)).catch(() => toast.error('Failed to load student')).finally(() => setLoading(false));
  };
  useEffect(fetchStudent, [id]);

  const handleSaveObservation = async () => {
    if (!obsText.trim()) return;
    setSavingObs(true);
    try {
      await studentAPI.addObservation(id!, { text: obsText, teacherId: user?.id });
      toast.success('Observation saved!');
      setObsText('');
      fetchStudent();
    } catch {
      toast.error('Failed to save observation');
    } finally {
      setSavingObs(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  if (!student) return <div className="text-center py-16 text-slate-500">Student not found</div>;

  const profile = student.profile;
  const skills = profile?.skills ?? [];
  const overallStatus = profile?.overallStatus ?? 'unknown';
  const currentGroup = student.groupMembers?.[0]?.group;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
          <p className="text-slate-500 text-sm">Roll No: {student.rollNumber}</p>
        </div>
        <StatusBadge status={overallStatus} />
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">Overall Status</p>
          <p className="font-bold text-slate-800 mt-1 capitalize">{overallStatus.replace('_', ' ')}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">Current Group</p>
          <p className="font-bold text-slate-800 mt-1 text-xs">{currentGroup?.name ?? 'None'}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">Primary Gap</p>
          <p className="font-bold text-slate-800 mt-1 text-xs">{profile?.primaryGap || '—'}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">Skills Tracked</p>
          <p className="font-bold text-slate-800 mt-1">{skills.length}</p>
        </div>
      </div>

      {/* Skill mastery table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Skill Mastery Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5 italic">⚠️ DEMO DATA — values are simulated</p>
        </div>
        {skills.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No skill data yet. Complete an assessment first.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Skill</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">Mastery</th>
                <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {skills.map((ps: any) => (
                <tr key={ps.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <p className="text-sm font-medium text-slate-800">{ps.skill?.name}</p>
                    {ps.hasPrereqGap && (
                      <p className="text-xs text-amber-600 mt-0.5">⚠️ Possible prereq gap: {ps.prereqGapSkill}</p>
                    )}
                  </td>
                  <td className="p-3"><StatusBadge status={ps.status} /></td>
                  <td className="p-3">
                    <span className="text-sm font-bold text-slate-800">{Math.round(ps.masteryPct)}%</span>
                    <p className="text-xs text-slate-400">{ps.questionsCorrect}/{ps.questionsAttempted} correct</p>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <div className="w-full bg-slate-100 rounded-full h-2 max-w-32">
                      <div
                        className={`h-2 rounded-full ${ps.masteryPct >= 80 ? 'bg-green-500' : ps.masteryPct >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, ps.masteryPct)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Progress timeline */}
      {student.progressRecords?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock size={16} /> Learning Timeline
          </h2>
          <div className="space-y-3">
            {student.progressRecords.slice(0, 5).map((r: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs">{r.event === 'quickcheck' ? '✓' : '📋'}</span>
                </div>
                <div className="flex-1 pb-3 border-b border-slate-50 last:border-0">
                  <p className="text-sm font-semibold text-slate-800">{r.skillName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.statusBefore === 'needs_support' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.statusBefore.replace('_', ' ')} · {Math.round(r.masteryBefore)}%
                    </span>
                    <span className="text-slate-400 text-xs">→</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.statusAfter === 'mastered' ? 'bg-green-100 text-green-700' : r.statusAfter === 'developing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {r.statusAfter.replace('_', ' ')} · {Math.round(r.masteryAfter)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{new Date(r.recordedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher Observations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MessageSquare size={16} /> Teacher Observations
        </h2>
        {student.observations?.length > 0 ? (
          <div className="space-y-3 mb-4">
            {student.observations.map((obs: any) => (
              <div key={obs.id} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-sm text-amber-900">{obs.text}</p>
                {obs.skillContext && <p className="text-xs text-amber-600 mt-1">Re: {obs.skillContext}</p>}
                <p className="text-xs text-amber-400 mt-1">{new Date(obs.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 mb-4">No observations yet.</p>
        )}
        <div className="space-y-2">
          <textarea
            value={obsText}
            onChange={e => setObsText(e.target.value)}
            placeholder="Add observation... e.g. 'Can solve with help but struggles independently.'"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
          <button
            onClick={handleSaveObservation}
            disabled={savingObs || !obsText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {savingObs ? 'Saving...' : 'Save Observation'}
          </button>
        </div>
      </div>
    </div>
  );
}
