export interface GroupingRule {
  minGroupSize: number;
  maxGroupSize: number;
}

export interface StudentProfileData {
  studentId: string;
  overallStatus: 'mastered' | 'developing' | 'needs_support' | 'advanced';
  primaryGap: string; // skillId
  primaryGapName?: string;
  masteryPct: number; // of primary gap
}

export interface LearningGroupOutput {
  name: string;
  type: 'intervention' | 'on_track' | 'advanced' | 'mixed';
  primarySkillId: string;
  primarySkillName: string;
  studentIds: string[];
  avgMasteryPct: number;
  whyExplanation: string;
}

export function generateGroups(
  students: StudentProfileData[],
  rule: GroupingRule
): LearningGroupOutput[] {
  const groups: LearningGroupOutput[] = [];
  
  const advanced = students.filter(s => s.overallStatus === 'advanced' || s.overallStatus === 'mastered');
  const onTrack = students.filter(s => s.overallStatus === 'developing');
  const needsSupport = students.filter(s => s.overallStatus === 'needs_support');

  const gapGroups: Record<string, StudentProfileData[]> = {};
  for (const s of needsSupport) {
    if (!gapGroups[s.primaryGap]) gapGroups[s.primaryGap] = [];
    gapGroups[s.primaryGap].push(s);
  }

  let groupCounter = 1;

  for (const [skillId, groupStudents] of Object.entries(gapGroups)) {
    for (let i = 0; i < groupStudents.length; i += rule.maxGroupSize) {
      const chunk = groupStudents.slice(i, i + rule.maxGroupSize);
      const avgMastery = chunk.reduce((sum, s) => sum + s.masteryPct, 0) / chunk.length;
      const skillName = chunk[0].primaryGapName || skillId;
      
      groups.push({
        name: `Intervention Group ${groupCounter++}`,
        type: 'intervention',
        primarySkillId: skillId,
        primarySkillName: skillName,
        studentIds: chunk.map(s => s.studentId),
        avgMasteryPct: avgMastery,
        whyExplanation: `Grouped based on shared primary gap in "${skillName}".`
      });
    }
  }

  for (let i = 0; i < onTrack.length; i += rule.maxGroupSize) {
    const chunk = onTrack.slice(i, i + rule.maxGroupSize);
    groups.push({
      name: `On-Track Group ${groupCounter++}`,
      type: 'on_track',
      primarySkillId: '',
      primarySkillName: '',
      studentIds: chunk.map(s => s.studentId),
      avgMasteryPct: 0,
      whyExplanation: `Grouped based on developing overall proficiency. Needs guided practice.`
    });
  }

  for (let i = 0; i < advanced.length; i += rule.maxGroupSize) {
    const chunk = advanced.slice(i, i + rule.maxGroupSize);
    groups.push({
      name: `Advanced Group ${groupCounter++}`,
      type: 'advanced',
      primarySkillId: '',
      primarySkillName: '',
      studentIds: chunk.map(s => s.studentId),
      avgMasteryPct: 0,
      whyExplanation: `Students have demonstrated mastery. Ready for enrichment activities.`
    });
  }

  return groups;
}
