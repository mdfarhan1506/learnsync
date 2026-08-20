import React, { useEffect, useState } from 'react';
import { rulesAPI } from '../services/api';
import { useClassStore } from '../stores/classStore';
import { Settings, Save, RotateCcw, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RulesPage() {
  const currentClass = useClassStore(s => s.currentClass);
  const [rules, setRules] = useState<any>({ masteredMin: 80, developingMin: 50, minQuestionsForSkill: 2, minGroupSize: 3, maxGroupSize: 12, quickCheckCount: 3, requireTeacherApproval: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!currentClass?.id) { setLoading(false); return; }
    rulesAPI.get(currentClass.id).then(r => setRules(r.data)).finally(() => setLoading(false));
  }, [currentClass?.id]);

  const handleSave = async () => {
    if (!currentClass?.id) { toast.error('No class selected'); return; }
    setSaving(true);
    try {
      const res = await rulesAPI.update(currentClass.id, rules);
      setRules(res.data);
      toast.success('Rules saved!');
    } catch { toast.error('Failed to save rules'); }
    finally { setSaving(false); }
  };

  const handleReset = async () => {
    if (!currentClass?.id) return;
    setResetting(true);
    try {
      const res = await rulesAPI.reset(currentClass.id);
      setRules(res.data);
      toast.success('Rules reset to defaults!');
    } catch { toast.error('Failed to reset'); }
    finally { setResetting(false); }
  };

  const field = (label: string, key: string, type = 'number', min?: number, max?: number) => (
    <div key={key}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {type === 'toggle' ? (
        <button
          onClick={() => setRules((p: any) => ({ ...p, [key]: !p[key] }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rules[key] ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rules[key] ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      ) : (
        <input
          type="number"
          min={min}
          max={max}
          value={rules[key] ?? ''}
          onChange={e => setRules((p: any) => ({ ...p, [key]: Number(e.target.value) }))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      )}
    </div>
  );

  const masteredMin = rules.masteredMin ?? 80;
  const developingMin = rules.developingMin ?? 50;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings size={24} className="text-slate-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rules & Settings</h1>
          <p className="text-slate-500 text-sm">{currentClass ? `Configuring for ${currentClass.name}` : 'Select a class to configure'}</p>
        </div>
      </div>

      {/* Mastery thresholds */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-5">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-800">Skill Mastery Thresholds</h2>
          <div className="relative group">
            <Info size={14} className="text-slate-400 cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-2.5 hidden group-hover:block z-10">
              These thresholds determine how student performance is classified per skill. Applied to skill-level scores, not total assessment scores.
            </div>
          </div>
        </div>

        {/* Visual threshold bar */}
        <div className="space-y-2">
          <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden flex">
            <div className="bg-red-400 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${developingMin}%` }}>
              Needs Support
            </div>
            <div className="bg-yellow-400 flex items-center justify-center text-xs text-slate-800 font-medium" style={{ width: `${masteredMin - developingMin}%` }}>
              Developing
            </div>
            <div className="bg-green-500 flex items-center justify-center text-xs text-white font-medium flex-1">
              Mastered
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>0%</span>
            <span>{developingMin}%</span>
            <span>{masteredMin}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1.5"></span>
              Mastered: score ≥
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={100} value={masteredMin}
                onChange={e => setRules((p: any) => ({ ...p, masteredMin: Number(e.target.value) }))}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1.5"></span>
              Developing: score ≥
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={masteredMin - 1} value={developingMin}
                onChange={e => setRules((p: any) => ({ ...p, developingMin: Number(e.target.value) }))}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none" />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1">
          <p className="font-medium text-slate-700">Current classification:</p>
          <p><span className="text-green-600 font-semibold">Mastered</span> — ≥ {masteredMin}%</p>
          <p><span className="text-yellow-600 font-semibold">Developing</span> — {developingMin}% to {masteredMin - 1}%</p>
          <p><span className="text-red-600 font-semibold">Needs Support</span> — &lt; {developingMin}%</p>
        </div>
      </div>

      {/* Group settings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
        <h2 className="font-bold text-slate-800">Group & Assessment Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Min questions for skill classification', 'minQuestionsForSkill', 'number', 1, 10)}
          {field('Min group size', 'minGroupSize', 'number', 1, 20)}
          {field('Max group size', 'maxGroupSize', 'number', 2, 40)}
          {field('Quick check question count', 'quickCheckCount', 'number', 1, 10)}
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-700">Require teacher approval before final grouping</p>
            <p className="text-xs text-slate-500 mt-0.5">When enabled, teacher must review groups before they are shown to students.</p>
          </div>
          {field('', 'requireTeacherApproval', 'toggle')}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving || !currentClass?.id}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Rules'}
        </button>
        <button onClick={handleReset} disabled={resetting || !currentClass?.id}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-60">
          <RotateCcw size={16} /> {resetting ? 'Resetting...' : 'Reset to Defaults'}
        </button>
      </div>
    </div>
  );
}
