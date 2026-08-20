import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Layers } from 'lucide-react';

const ACTIVITY_LIBRARY = [
  { title: 'Base-Ten Block Manipulation', skill: 'Addition/Subtraction Regrouping', type: 'Hands-on', duration: '10 min', level: 'Needs Support', icon: '🧱', desc: 'Use physical or virtual base-ten blocks to show regrouping concretely.' },
  { title: 'Skip Counting Song', skill: 'Multiplication Facts', type: 'Activity', duration: '5 min', level: 'Developing', icon: '🎵', desc: 'Use rhythmic skip counting (2s, 5s, 10s) to build multiplication fluency.' },
  { title: 'Fact Family Triangles', skill: 'Division Facts', type: 'Visual Aid', duration: '10 min', level: 'Developing', icon: '🔺', desc: 'Create triangle cards showing the 3 related multiplication/division facts.' },
  { title: 'Place Value Chart Activity', skill: 'Place Value', type: 'Visual Aid', duration: '8 min', level: 'Needs Support', icon: '📊', desc: 'Draw and label a 6-column place value chart, place digit cards in correct position.' },
  { title: 'Multiplication Array Drawing', skill: 'Multi-digit Multiplication', type: 'Visual Aid', duration: '12 min', level: 'Developing', icon: '⬜', desc: 'Draw arrays to visualise 2-digit × 1-digit multiplication problems.' },
  { title: 'Number Line Jumps', skill: 'Addition/Subtraction Regrouping', type: 'Visual Aid', duration: '8 min', level: 'Needs Support', icon: '➡️', desc: 'Use a large number line to show jumps for addition and subtraction.' },
  { title: 'Challenge: Multi-step Word Problems', skill: 'Any', type: 'Challenge', duration: '15 min', level: 'Advanced', icon: '🏆', desc: 'Multi-step problems requiring 2-3 operations. Self-check with inverse operations.' },
  { title: 'Whiteboard Quick Fire', skill: 'Multiplication / Division Facts', type: 'Class Activity', duration: '5 min', level: 'Any', icon: '⚡', desc: 'Teacher calls out a fact, all students show their answer on personal whiteboards simultaneously.' },
];

const levelColors: Record<string, string> = {
  'Needs Support': 'bg-red-100 text-red-700',
  'Developing': 'bg-yellow-100 text-yellow-700',
  'Advanced': 'bg-purple-100 text-purple-700',
  'Any': 'bg-slate-100 text-slate-600',
};

export default function ActivitiesPage() {
  const [filter, setFilter] = React.useState('All');
  const skills = ['All', ...Array.from(new Set(ACTIVITY_LIBRARY.map(a => a.skill)))];
  const filtered = filter === 'All' ? ACTIVITY_LIBRARY : ACTIVITY_LIBRARY.filter(a => a.skill === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Layers size={24} className="text-slate-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Library</h1>
          <p className="text-slate-500 mt-0.5">Pre-built classroom activities for every skill level</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
        <span className="text-blue-600 text-sm">💡</span>
        <p className="text-blue-700 text-sm">Activities are automatically selected by the AI when you generate an intervention. Browse here to inspire your planning.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {skills.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((act, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-blue-200 transition-colors">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{act.icon}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-slate-800">{act.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full shrink-0">{act.duration}</span>
                </div>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[act.level]}`}>{act.level}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{act.type}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full">{act.skill}</span>
                </div>
                <p className="text-sm text-slate-600">{act.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link to="/groups">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 mx-auto">
            <BookOpen size={16} /> Generate AI Intervention for a Group
            <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
}
