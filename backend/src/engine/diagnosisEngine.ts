export interface DiagnosisRule {
  masteredMin: number;
  developingMin: number;
}

export interface StudentAnswerData {
  questionId: string;
  isCorrect: boolean;
}

export interface QuestionSkillData {
  questionId: string;
  skillId: string;
  weight: number;
}

export interface SkillData {
  id: string;
  name: string;
  prerequisites: string[]; // skill IDs
}

export interface LearningProfileSkillOutput {
  skillId: string;
  skillName: string;
  masteryPct: number;
  status: 'mastered' | 'developing' | 'needs_support';
  questionsAttempted: number;
  questionsCorrect: number;
  hasPrereqGap: boolean;
  prereqGapSkill: string;
}

export interface LearningProfileOutput {
  studentId: string;
  overallStatus: 'mastered' | 'developing' | 'needs_support' | 'advanced';
  primaryGap: string;
  secondaryGap: string;
  skills: LearningProfileSkillOutput[];
}

export function diagnoseStudent(
  studentId: string,
  answers: StudentAnswerData[],
  questionSkills: QuestionSkillData[],
  skills: SkillData[],
  rule: DiagnosisRule
): LearningProfileOutput {
  const skillStats: Record<string, { attempted: number, correct: number, weightTotal: number, weightCorrect: number }> = {};
  
  for (const skill of skills) {
    skillStats[skill.id] = { attempted: 0, correct: 0, weightTotal: 0, weightCorrect: 0 };
  }

  for (const answer of answers) {
    const qSkills = questionSkills.filter(qs => qs.questionId === answer.questionId);
    for (const qs of qSkills) {
      if (!skillStats[qs.skillId]) {
        skillStats[qs.skillId] = { attempted: 0, correct: 0, weightTotal: 0, weightCorrect: 0 };
      }
      skillStats[qs.skillId].attempted += 1;
      skillStats[qs.skillId].weightTotal += qs.weight;
      if (answer.isCorrect) {
        skillStats[qs.skillId].correct += 1;
        skillStats[qs.skillId].weightCorrect += qs.weight;
      }
    }
  }

  const profileSkills: LearningProfileSkillOutput[] = [];
  
  for (const skill of skills) {
    const stats = skillStats[skill.id];
    let masteryPct = 0;
    if (stats.weightTotal > 0) {
      masteryPct = (stats.weightCorrect / stats.weightTotal) * 100;
    } else if (stats.attempted > 0) {
      masteryPct = (stats.correct / stats.attempted) * 100;
    }

    let status: 'mastered' | 'developing' | 'needs_support' = 'needs_support';
    if (masteryPct >= rule.masteredMin) status = 'mastered';
    else if (masteryPct >= rule.developingMin) status = 'developing';

    profileSkills.push({
      skillId: skill.id,
      skillName: skill.name,
      masteryPct,
      status,
      questionsAttempted: stats.attempted,
      questionsCorrect: stats.correct,
      hasPrereqGap: false,
      prereqGapSkill: ''
    });
  }

  for (const ps of profileSkills) {
    const skill = skills.find(s => s.id === ps.skillId);
    if (skill && skill.prerequisites.length > 0) {
      for (const prereqId of skill.prerequisites) {
        const prereqProfile = profileSkills.find(p => p.skillId === prereqId);
        if (prereqProfile && prereqProfile.status === 'needs_support') {
          ps.hasPrereqGap = true;
          ps.prereqGapSkill = prereqProfile.skillName;
          break;
        }
      }
    }
  }

  const needsSupportSkills = profileSkills.filter(ps => ps.status === 'needs_support').sort((a, b) => a.masteryPct - b.masteryPct);
  const developingSkills = profileSkills.filter(ps => ps.status === 'developing').sort((a, b) => a.masteryPct - b.masteryPct);
  
  let overallStatus: 'mastered' | 'developing' | 'needs_support' | 'advanced' = 'mastered';
  let primaryGap = '';
  let secondaryGap = '';

  if (needsSupportSkills.length > 0) {
    overallStatus = 'needs_support';
    primaryGap = needsSupportSkills[0].skillId;
    if (needsSupportSkills.length > 1) {
      secondaryGap = needsSupportSkills[1].skillId;
    } else if (developingSkills.length > 0) {
      secondaryGap = developingSkills[0].skillId;
    }
  } else if (developingSkills.length > 0) {
    overallStatus = 'developing';
    primaryGap = developingSkills[0].skillId;
    if (developingSkills.length > 1) {
      secondaryGap = developingSkills[1].skillId;
    }
  } else {
    overallStatus = profileSkills.length > 0 ? 'advanced' : 'unknown' as any;
  }

  return {
    studentId,
    overallStatus,
    primaryGap,
    secondaryGap,
    skills: profileSkills
  };
}
