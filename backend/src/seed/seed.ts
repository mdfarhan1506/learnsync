import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { indianStudentNames, demoSkills, diagnosticQuestions } from './demoData';
// Generate a valid bcrypt hash at runtime
const DEMO_PASSWORD_HASH = bcrypt.hashSync('demo1234', 10);

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('Starting seed...');

  // 1. Clear existing data
  console.log('Clearing database...');
  await prisma.activityHistory.deleteMany();
  await prisma.progressRecord.deleteMany();
  await prisma.quickCheckResult.deleteMany();
  await prisma.quickCheck.deleteMany();
  await prisma.interventionActivity.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.groupOverride.deleteMany();
  await prisma.learningGroupMember.deleteMany();
  await prisma.learningGroup.deleteMany();
  await prisma.learningProfileSkill.deleteMany();
  await prisma.learningProfile.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.assessmentSubmission.deleteMany();
  await prisma.questionSkillMapping.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.assessmentRule.deleteMany();
  await prisma.skillPrerequisite.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.teacherObservation.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Teacher
  console.log('Creating teacher...');
  const teacher = await prisma.user.create({
    data: {
      name: 'Priya Mehta',
      email: 'teacher@learnsync.demo',
      passwordHash: DEMO_PASSWORD_HASH,
      role: 'teacher'
    }
  });

  // 3. Create Class
  const mathClass = await prisma.class.create({
    data: {
      name: '5A',
      grade: '5',
      section: 'A',
      subject: 'Math',
      academicYear: '2026-2027',
      teacherId: teacher.id,
      currentTopic: 'Fractions'
    }
  });

  await prisma.assessmentRule.create({
    data: {
      classId: mathClass.id,
    }
  });

  // 4. Create Subjects, Topics, Skills
  console.log('Creating curriculum data...');
  const subject = await prisma.subject.create({
    data: {
      name: 'Math',
      grade: 'Grade 5'
    }
  });

  const topic = await prisma.topic.create({
    data: {
      name: 'Number Operations',
      subjectId: subject.id
    }
  });

  const skillMap = new Map();
  for (const s of demoSkills) {
    const skill = await prisma.skill.create({
      data: {
        name: s.name,
        topicId: topic.id,
        grade: s.grade,
        subject: s.subject,
        description: s.description,
        difficulty: 'medium'
      }
    });
    skillMap.set(s.name, skill.id);
  }

  // Create prerequisites
  for (const s of demoSkills) {
    const dependentId = skillMap.get(s.name);
    for (const prereqName of s.prerequisites) {
      const prereqId = skillMap.get(prereqName);
      if (prereqId && dependentId) {
        await prisma.skillPrerequisite.create({
          data: {
            skillId: dependentId,
            prerequisiteId: prereqId
          }
        });
      }
    }
  }

  // 5. Create Students
  console.log('Creating students...');
  const students = [];
  for (let i = 0; i < 40; i++) {
    const student = await prisma.student.create({
      data: {
        name: indianStudentNames[i] || `Student ${i+1}`,
        rollNumber: `R${(i + 1).toString().padStart(3, '0')}`,
        classId: mathClass.id,
        isDemo: true
      }
    });
    students.push(student);
  }

  // Assign students to mock group categories for realistic data generation
  // 7 Needs Support - Regrouping (indices 0-6)
  // 8 Needs Support - Division Facts (indices 7-14)
  // 15 On Track (indices 15-29)
  // 10 Advanced (indices 30-39)

  // 6. Create Diagnostic Assessment
  console.log('Creating assessment and questions...');
  const assessment = await prisma.assessment.create({
    data: {
      title: 'Beginning of Year Diagnostic',
      classId: mathClass.id,
      topicId: topic.id,
      type: 'diagnostic',
      status: 'completed',
      classCode: 'MATH5A-DIAG',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    }
  });

  const questionObjects = [];
  for (let i = 0; i < diagnosticQuestions.length; i++) {
    const dq = diagnosticQuestions[i];
    const q = await prisma.question.create({
      data: {
        assessmentId: assessment.id,
        text: dq.text,
        optionA: dq.options[0],
        optionB: dq.options[1],
        optionC: dq.options[2],
        optionD: dq.options[3],
        correctAnswer: dq.correct,
        difficulty: dq.diff,
        orderIndex: i
      }
    });
    
    await prisma.questionSkillMapping.create({
      data: {
        questionId: q.id,
        skillId: skillMap.get(dq.skill),
        weight: 1.0
      }
    });
    
    questionObjects.push({ ...q, skillName: dq.skill });
  }

  // 7. Simulate Submissions and Profiles
  console.log('Simulating student submissions...');
  for (let i = 0; i < 40; i++) {
    const student = students[i];
    let groupCat = '';
    if (i < 7) groupCat = 'needs_regrouping';
    else if (i < 15) groupCat = 'needs_division';
    else if (i < 30) groupCat = 'on_track';
    else groupCat = 'advanced';

    let correctCount = 0;
    
    const submission = await prisma.assessmentSubmission.create({
      data: {
        assessmentId: assessment.id,
        studentId: student.id,
        status: 'completed',
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    });

    const skillStats = new Map(); // track correct/attempted per skill

    for (const q of questionObjects) {
      if (!skillStats.has(q.skillName)) {
        skillStats.set(q.skillName, { correct: 0, attempted: 0 });
      }
      skillStats.get(q.skillName).attempted += 1;

      let isCorrect = true;

      // Logic to determine if student gets it right based on their group
      if (groupCat === 'needs_regrouping') {
        if (q.skillName === 'Addition/Subtraction Regrouping') isCorrect = Math.random() > 0.8; // mostly wrong
        else if (q.skillName === 'Basic Division') isCorrect = Math.random() > 0.6; // struggles a bit because of prereq
        else isCorrect = Math.random() > 0.2; 
      } else if (groupCat === 'needs_division') {
        if (q.skillName === 'Division Facts') isCorrect = Math.random() > 0.8; // mostly wrong
        else if (q.skillName === 'Basic Division') isCorrect = Math.random() > 0.8; // struggles heavily due to prereq
        else isCorrect = Math.random() > 0.2;
      } else if (groupCat === 'on_track') {
        isCorrect = Math.random() > 0.15; // mostly correct
      } else if (groupCat === 'advanced') {
        isCorrect = Math.random() > 0.05; // almost perfect
      }

      if (isCorrect) {
        correctCount++;
        skillStats.get(q.skillName).correct += 1;
      }

      // Pick selected answer
      let selectedOption = isCorrect ? q.correctAnswer : ['A', 'B', 'C', 'D'].find(o => o !== q.correctAnswer);

      await prisma.studentAnswer.create({
        data: {
          submissionId: submission.id,
          questionId: q.id,
          studentId: student.id,
          selectedAnswer: selectedOption as string,
          isCorrect
        }
      });
    }

    const percentScore = (correctCount / 20) * 100;

    await prisma.assessmentSubmission.update({
      where: { id: submission.id },
      data: {
        totalScore: correctCount,
        totalPossible: 20,
        percentScore
      }
    });

    // Create Learning Profile
    let overallStatus = 'developing';
    if (percentScore >= 90) overallStatus = 'advanced';
    else if (percentScore >= 70) overallStatus = 'mastered';
    else if (percentScore < 50) overallStatus = 'needs_support';

    let primaryGap = '';
    if (groupCat === 'needs_regrouping') primaryGap = 'Addition/Subtraction Regrouping';
    else if (groupCat === 'needs_division') primaryGap = 'Division Facts';

    const profile = await prisma.learningProfile.create({
      data: {
        studentId: student.id,
        overallStatus,
        primaryGap,
        lastAssessmentId: assessment.id
      }
    });

    // Profile Skills
    for (const [skillName, stats] of skillStats.entries()) {
      const masteryPct = (stats.correct / stats.attempted) * 100;
      let status = 'developing';
      if (masteryPct >= 80) status = 'mastered';
      else if (masteryPct < 50) status = 'needs_support';

      await prisma.learningProfileSkill.create({
        data: {
          profileId: profile.id,
          skillId: skillMap.get(skillName),
          masteryPct,
          status,
          questionsAttempted: stats.attempted,
          questionsCorrect: stats.correct
        }
      });
    }
  }

  // 8. Create Learning Groups
  console.log('Creating learning groups...');
  const group1 = await prisma.learningGroup.create({
    data: {
      classId: mathClass.id,
      assessmentId: assessment.id,
      name: 'Needs Support: Regrouping',
      type: 'intervention',
      primarySkillId: skillMap.get('Addition/Subtraction Regrouping'),
      primarySkillName: 'Addition/Subtraction Regrouping',
      avgMasteryPct: 25.5,
      whyExplanation: 'These 7 students struggled with Addition/Subtraction Regrouping, answering less than 30% correctly on average. They have a solid foundation in Place Value but need targeted practice on the regrouping algorithm.',
      recommendedAction: 'Schedule a 15-minute intervention using manipulatives (base-ten blocks) to model trading tens for ones.',
      colorCode: 'red'
    }
  });

  const group2 = await prisma.learningGroup.create({
    data: {
      classId: mathClass.id,
      assessmentId: assessment.id,
      name: 'Needs Support: Division Facts',
      type: 'intervention',
      primarySkillId: skillMap.get('Division Facts'),
      primarySkillName: 'Division Facts',
      avgMasteryPct: 30.0,
      whyExplanation: 'These 8 students are missing prerequisite Division Facts which is hindering their ability to perform Basic Division. They scored under 40% on division fact recall.',
      recommendedAction: 'Assign targeted fluency games and flashcard practice for 10 minutes daily.',
      colorCode: 'orange'
    }
  });

  const group3 = await prisma.learningGroup.create({
    data: {
      classId: mathClass.id,
      assessmentId: assessment.id,
      name: 'On Track: Core Skills',
      type: 'on_track',
      primarySkillId: skillMap.get('Basic Division'),
      primarySkillName: 'Basic Division',
      avgMasteryPct: 82.0,
      whyExplanation: 'These 15 students demonstrated mastery of foundational skills and are ready to proceed with the standard 5th grade curriculum pacing.',
      recommendedAction: 'Continue with standard lesson plans.',
      colorCode: 'blue'
    }
  });

  const group4 = await prisma.learningGroup.create({
    data: {
      classId: mathClass.id,
      assessmentId: assessment.id,
      name: 'Advanced: Enrichment',
      type: 'advanced',
      primarySkillId: skillMap.get('Basic Division'),
      primarySkillName: 'Basic Division',
      avgMasteryPct: 96.5,
      whyExplanation: 'These 10 students scored above 90% across all domains, including multi-digit operations.',
      recommendedAction: 'Provide enrichment activities focusing on word problems and multi-step equations.',
      colorCode: 'green'
    }
  });

  // Assign members to groups
  for (let i = 0; i < 40; i++) {
    let groupId = '';
    if (i < 7) groupId = group1.id;
    else if (i < 15) groupId = group2.id;
    else if (i < 30) groupId = group3.id;
    else groupId = group4.id;

    await prisma.learningGroupMember.create({
      data: {
        groupId,
        studentId: students[i].id
      }
    });
  }

  // 9. Create Intervention for Group 1
  console.log('Creating interventions and progress records...');
  const intervention = await prisma.intervention.create({
    data: {
      groupId: group1.id,
      skillId: skillMap.get('Addition/Subtraction Regrouping'),
      title: 'Regrouping with Base-Ten Blocks',
      status: 'completed',
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      durationMins: 15
    }
  });

  await prisma.interventionActivity.create({
    data: {
      interventionId: intervention.id,
      title: 'Modeling Subtraction',
      objective: 'Students will visually trade 1 ten for 10 ones using blocks.',
      materials: 'Base-ten blocks, whiteboards',
      steps: JSON.stringify([
        "Set up the number 52 using blocks.",
        "Ask how to subtract 18.",
        "Demonstrate trading 1 ten rod for 10 unit cubes.",
        "Subtract 8 ones, then 1 ten.",
        "Have students practice with 45 - 17."
      ]),
      isApproved: true
    }
  });

  const quickCheck = await prisma.quickCheck.create({
    data: {
      interventionId: intervention.id,
      status: 'completed',
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  });

  // Progress and Results for Group 1
  for (let i = 0; i < 7; i++) {
    const student = students[i];
    
    // Quick Check Result
    const score = Math.random() > 0.3 ? 3 : 2; // mostly mastered now
    await prisma.quickCheckResult.create({
      data: {
        quickCheckId: quickCheck.id,
        studentId: student.id,
        status: score === 3 ? 'mastered' : 'still_needs_practice',
        score,
        maxScore: 3
      }
    });

    // Progress Record
    await prisma.progressRecord.create({
      data: {
        studentId: student.id,
        skillName: 'Addition/Subtraction Regrouping',
        masteryBefore: 25.0,
        masteryAfter: score === 3 ? 90.0 : 66.0,
        statusBefore: 'needs_support',
        statusAfter: score === 3 ? 'mastered' : 'developing',
        event: 'intervention',
        eventId: intervention.id
      }
    });

    // Update their LearningProfileSkill
    await prisma.learningProfileSkill.updateMany({
      where: {
        profile: { studentId: student.id },
        skillId: skillMap.get('Addition/Subtraction Regrouping')
      },
      data: {
        masteryPct: score === 3 ? 90.0 : 66.0,
        status: score === 3 ? 'mastered' : 'developing'
      }
    });

    // Teacher Observation
    if (i < 3) {
      await prisma.teacherObservation.create({
        data: {
          studentId: student.id,
          teacherId: teacher.id,
          text: 'Responded very well to the visual base-ten blocks. Successfully traded tens for ones without prompting.',
          skillContext: 'Addition/Subtraction Regrouping'
        }
      });
    }
  }

  console.log('Seed completed successfully!');
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
