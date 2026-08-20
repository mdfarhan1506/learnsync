// Mock AI Service — provides realistic Grade 5 Math content without needing an LLM API
// All responses are clearly seeded/demo content

export interface MockQuestion {
  text: string;
  type: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  isAiGenerated: boolean;
}

export interface MockInterventionActivity {
  title: string;
  objective: string;
  materials: string;
  steps: string; // JSON string array
  examples: string;
  differentiation: string;
  isAiGenerated: boolean;
  isDemoAI: boolean;
}

// Skill-specific question banks
const questionBank: Record<string, MockQuestion[]> = {
  'Multiplication Facts': [
    { text: '7 × 8 = ?', type: 'mcq', optionA: '54', optionB: '56', optionC: '64', optionD: '48', correctAnswer: 'B', explanation: '7 × 8 = 56. Think: 7 × 8 = 7 × (4+4) = 28+28 = 56', difficulty: 'easy', isAiGenerated: true },
    { text: '9 × 6 = ?', type: 'mcq', optionA: '45', optionB: '52', optionC: '54', optionD: '63', correctAnswer: 'C', explanation: '9 × 6 = 54. Shortcut: 10×6=60, subtract one 6 = 54', difficulty: 'easy', isAiGenerated: true },
    { text: '12 × 7 = ?', type: 'mcq', optionA: '72', optionB: '78', optionC: '82', optionD: '84', correctAnswer: 'D', explanation: '12 × 7 = 84. Think: 10×7=70 + 2×7=14 → 84', difficulty: 'medium', isAiGenerated: true },
    { text: '8 × 11 = ?', type: 'mcq', optionA: '80', optionB: '88', optionC: '96', optionD: '99', correctAnswer: 'B', explanation: '8 × 11 = 88. Trick: 8×11 = 8×10 + 8×1 = 80+8 = 88', difficulty: 'medium', isAiGenerated: true },
    { text: '6 × 9 = ?', type: 'mcq', optionA: '48', optionB: '52', optionC: '54', optionD: '56', correctAnswer: 'C', explanation: '6 × 9 = 54. Same as 9 × 6 = 54', difficulty: 'easy', isAiGenerated: true },
  ],
  'Division Facts': [
    { text: '42 ÷ 6 = ?', type: 'mcq', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'B', explanation: '42 ÷ 6 = 7, because 6 × 7 = 42', difficulty: 'easy', isAiGenerated: true },
    { text: '63 ÷ 9 = ?', type: 'mcq', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'B', explanation: '63 ÷ 9 = 7, because 9 × 7 = 63', difficulty: 'easy', isAiGenerated: true },
    { text: '72 ÷ 8 = ?', type: 'mcq', optionA: '7', optionB: '8', optionC: '9', optionD: '10', correctAnswer: 'C', explanation: '72 ÷ 8 = 9, because 8 × 9 = 72', difficulty: 'medium', isAiGenerated: true },
    { text: '48 ÷ 6 = ?', type: 'mcq', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'C', explanation: '48 ÷ 6 = 8, because 6 × 8 = 48', difficulty: 'easy', isAiGenerated: true },
    { text: '56 ÷ 7 = ?', type: 'mcq', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'C', explanation: '56 ÷ 7 = 8, because 7 × 8 = 56', difficulty: 'medium', isAiGenerated: true },
  ],
  'Addition/Subtraction Regrouping': [
    { text: '342 + 189 = ?', type: 'mcq', optionA: '521', optionB: '531', optionC: '431', optionD: '421', correctAnswer: 'B', explanation: 'Add ones: 2+9=11, write 1 carry 1. Tens: 4+8+1=13, write 3 carry 1. Hundreds: 3+1+1=5. Answer: 531', difficulty: 'easy', isAiGenerated: true },
    { text: '502 − 176 = ?', type: 'mcq', optionA: '326', optionB: '336', optionC: '426', optionD: '226', correctAnswer: 'A', explanation: 'Regroup: 502 → 401+10+2. Ones: 12−6=6. Tens: 9−7=2. Hundreds: 4−1=3. Answer: 326', difficulty: 'medium', isAiGenerated: true },
    { text: '4,000 − 1,245 = ?', type: 'mcq', optionA: '2,755', optionB: '3,755', optionC: '2,855', optionD: '3,855', correctAnswer: 'A', explanation: '4000 − 1245 = 2755. Check: 2755 + 1245 = 4000 ✓', difficulty: 'hard', isAiGenerated: true },
    { text: '7,894 + 3,456 = ?', type: 'mcq', optionA: '10,350', optionB: '11,250', optionC: '11,350', optionD: '10,250', correctAnswer: 'C', explanation: 'Add column by column right to left with regrouping. Result: 11,350', difficulty: 'hard', isAiGenerated: true },
    { text: '600 − 237 = ?', type: 'mcq', optionA: '363', optionB: '373', optionC: '463', optionD: '263', correctAnswer: 'A', explanation: 'Regroup 600 → 500+90+10. Ones: 10−7=3. Tens: 9−3=6. Hundreds: 5−2=3. Answer: 363', difficulty: 'medium', isAiGenerated: true },
  ],
  'Place Value': [
    { text: 'What is the value of 7 in 4,732,100?', type: 'mcq', optionA: '700', optionB: '7,000', optionC: '70,000', optionD: '700,000', correctAnswer: 'D', explanation: 'In 4,732,100 the 7 is in the hundred-thousands place, so its value is 700,000', difficulty: 'easy', isAiGenerated: true },
    { text: 'Which number has a 5 in the ten-thousands place?', type: 'mcq', optionA: '1,050,000', optionB: '5,200,000', optionC: '154,320', optionD: '10,500', correctAnswer: 'C', explanation: 'In 154,320 the 5 is in the ten-thousands place (5 × 10,000 = 50,000)', difficulty: 'medium', isAiGenerated: true },
    { text: 'Write 40,000 + 3,000 + 20 + 9 in standard form.', type: 'mcq', optionA: '43,029', optionB: '40,329', optionC: '43,290', optionD: '4,329', correctAnswer: 'A', explanation: '40,000 + 3,000 + 0 hundreds + 20 + 9 = 43,029', difficulty: 'medium', isAiGenerated: true },
  ],
  'Multi-digit Multiplication': [
    { text: '34 × 5 = ?', type: 'mcq', optionA: '170', optionB: '150', optionC: '160', optionD: '180', correctAnswer: 'A', explanation: '34 × 5 = (30×5) + (4×5) = 150 + 20 = 170', difficulty: 'easy', isAiGenerated: true },
    { text: '123 × 4 = ?', type: 'mcq', optionA: '482', optionB: '492', optionC: '502', optionD: '392', correctAnswer: 'B', explanation: '123 × 4 = (100×4) + (20×4) + (3×4) = 400+80+12 = 492', difficulty: 'medium', isAiGenerated: true },
    { text: '45 × 12 = ?', type: 'mcq', optionA: '540', optionB: '520', optionC: '640', optionD: '440', correctAnswer: 'A', explanation: '45 × 12 = 45×10 + 45×2 = 450+90 = 540', difficulty: 'hard', isAiGenerated: true },
  ],
  'Basic Division': [
    { text: '84 ÷ 4 = ?', type: 'mcq', optionA: '21', optionB: '22', optionC: '24', optionD: '12', correctAnswer: 'A', explanation: '84 ÷ 4 = 21. Check: 4 × 21 = 84 ✓', difficulty: 'easy', isAiGenerated: true },
    { text: '125 ÷ 5 = ?', type: 'mcq', optionA: '15', optionB: '25', optionC: '35', optionD: '45', correctAnswer: 'B', explanation: '125 ÷ 5 = 25. Check: 5 × 25 = 125 ✓', difficulty: 'medium', isAiGenerated: true },
    { text: '432 ÷ 6 = ?', type: 'mcq', optionA: '62', optionB: '72', optionC: '82', optionD: '92', correctAnswer: 'B', explanation: '432 ÷ 6 = 72. Check: 6 × 72 = 432 ✓', difficulty: 'hard', isAiGenerated: true },
  ]
};

// Skill-specific intervention templates
const interventionTemplates: Record<string, any> = {
  'Addition/Subtraction Regrouping': {
    title: 'Regrouping with Tens and Ones',
    objective: 'Students will understand how 10 ones become 1 ten (and vice versa) and apply this to multi-digit addition and subtraction.',
    materials: 'Blackboard, coloured chalk, base-ten blocks (tens rods and unit cubes), student whiteboards',
    steps: JSON.stringify([
      'STEP 1 (2 min) — Hook: Write "27 + 18" on the board. Ask: "Can we add 7 ones and 8 ones?" Show that 15 ones must be regrouped.',
      'STEP 2 (3 min) — Model: Using base-ten blocks, physically trade 10 unit cubes for 1 tens rod. Show the result: 4 tens and 5 ones = 45.',
      'STEP 3 (3 min) — Guided Practice: Write "43 + 29" on the board. Call one student to arrange blocks. Guide the class through each step.',
      'STEP 4 (2 min) — Student Practice: Students solve "35 + 46" on their whiteboards using blocks. Teacher circulates.',
      'STEP 5 (Wrap-up): "What do we do when we have more than 9 in any column?" Elicit: "We regroup!" Quick check follows.'
    ]),
    examples: 'Worked example 1: 27 + 18. Worked example 2: 52 − 17 (show borrowing). Common error: forgetting to add the carried digit.',
    differentiation: 'Struggling students: Provide a step-by-step checklist. Advanced students: Try 3-digit problems like 345 + 276.'
  },
  'Division Facts': {
    title: 'Division Facts Fluency — Skip Counting Connection',
    objective: 'Students will connect multiplication facts to division facts and build fluency using skip counting.',
    materials: 'Blackboard, multiplication chart (for reference), number cards, timer',
    steps: JSON.stringify([
      'STEP 1 (2 min) — Connection: "Division is the reverse of multiplication. If 6 × 7 = 42, then 42 ÷ 6 = ?"',
      'STEP 2 (3 min) — Model: Use the multiplication chart. Show how to find 56 ÷ 8: Find 8 in the row, trace to 56, the column header is 7.',
      'STEP 3 (3 min) — Choral Practice: Teacher calls a division fact, students respond together. 72÷9? ... 54÷6? ... 48÷8?',
      'STEP 4 (3 min) — Partner Game: Student A says a division fact, Student B answers. Switch roles.',
      'STEP 5 (Wrap-up): "Every division fact has a multiplication partner." Quick check follows.'
    ]),
    examples: 'Family: 6 × 8 = 48, so 48 ÷ 6 = 8 and 48 ÷ 8 = 6. Always check: multiply your answer back.',
    differentiation: 'Use a multiplication table for students who need it. Challenge: create their own fact families with 3 facts each.'
  },
  'Multiplication Facts': {
    title: 'Multiplication Facts — Building Fluency',
    objective: 'Students will practise and recall multiplication facts for 6, 7, 8, and 9 with increasing speed.',
    materials: 'Flashcards, whiteboard, timer',
    steps: JSON.stringify([
      'STEP 1 (2 min) — Warm Up: Rapid fire with known facts (×2, ×5, ×10). Build confidence.',
      'STEP 2 (3 min) — Teach the 9-trick: 9 × 6 — hold up 6th finger. Count left fingers (5), right fingers (4) → 54.',
      'STEP 3 (3 min) — Doubles strategy for ×6 and ×8: 6×7 = double of 3×7 = double of 21 = 42.',
      'STEP 4 (3 min) — Flashcard round: Teacher shows card, students write on whiteboard.',
      'STEP 5 (Wrap-up): Target the 3 hardest facts: 6×7, 7×8, 8×9. Practice these 5 times.'
    ]),
    examples: '7 × 8 = 56 (memory trick: 5, 6, 7, 8 → 56=7×8). 6 × 9 = 54 (9-finger trick).',
    differentiation: 'Struggling: focus on ×6 only. Advanced: Beat the clock — how many in 60 seconds?'
  },
  'Place Value': {
    title: 'Place Value — Understanding Large Numbers',
    objective: 'Students will identify the value of digits up to the hundred-thousands place.',
    materials: 'Place value chart (drawn on board), number cards 0-9',
    steps: JSON.stringify([
      'STEP 1 (2 min) — Draw a 6-column place value chart on the board: Hundred-Thousands | Ten-Thousands | Thousands | Hundreds | Tens | Ones.',
      'STEP 2 (3 min) — Model: Write 345,682. "What is the value of 3?" Point to chart. 3 is in hundred-thousands = 300,000.',
      'STEP 3 (3 min) — Guided: Students point to the correct column for each digit in 127,490.',
      'STEP 4 (2 min) — Whiteboard: Teacher says a value (e.g., "7 ten-thousands"), students write a number containing it.',
      'STEP 5 (Wrap-up): "The position of a digit tells us its value." Quick check follows.'
    ]),
    examples: 'In 452,316: 4 = 400,000 (hundred-thousands), 5 = 50,000 (ten-thousands), 2 = 2,000 (thousands).',
    differentiation: 'Struggling: use 4-digit numbers only. Advanced: write numbers in expanded form.'
  }
};

export const mockAI = {
  generateQuestions: async (topic: string, skill: string, count: number, difficulty: string): Promise<MockQuestion[]> => {
    // Find best matching skill bank
    const skillKey = Object.keys(questionBank).find(k =>
      k.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(k.toLowerCase())
    ) || 'Addition/Subtraction Regrouping';

    const bank = questionBank[skillKey] || questionBank['Addition/Subtraction Regrouping'];

    // Filter by difficulty if specified
    let filtered = difficulty && difficulty !== 'mixed'
      ? bank.filter(q => q.difficulty === difficulty)
      : bank;

    if (filtered.length === 0) filtered = bank;

    // Return up to count questions, cycling if needed
    const result: MockQuestion[] = [];
    for (let i = 0; i < count; i++) {
      result.push({ ...filtered[i % filtered.length] });
    }

    return result;
  },

  generateIntervention: async (skill: string, masteryPct: number, grade: string, duration: number): Promise<MockInterventionActivity> => {
    const template = interventionTemplates[skill] || interventionTemplates['Addition/Subtraction Regrouping'];

    return {
      title: template.title,
      objective: template.objective,
      materials: template.materials,
      steps: template.steps,
      examples: template.examples,
      differentiation: template.differentiation,
      isAiGenerated: true,
      isDemoAI: true
    };
  },

  generateOtherActivities: async (groups: Array<{ type: string; primarySkillName: string }>) => {
    return groups.map(g => {
      if (g.type === 'advanced') {
        return {
          targetGroup: 'advanced',
          title: 'Challenge: Multi-Step Word Problems',
          objective: 'Apply multiple operations to solve complex real-world problems.',
          materials: 'Challenge worksheet (see Appendix), pencil',
          steps: JSON.stringify([
            'Read the word problem carefully.',
            'Underline the key information.',
            'Identify which operations to use.',
            'Solve step by step, showing all working.',
            'Check your answer using the inverse operation.'
          ]),
          isAiGenerated: true
        };
      }
      if (g.type === 'on_track') {
        return {
          targetGroup: 'on_track',
          title: `Textbook Practice — ${g.primarySkillName || 'Core Skills'}`,
          objective: 'Consolidate understanding through structured independent practice.',
          materials: 'Mathematics textbook (Grade 5), exercise book, pencil',
          steps: JSON.stringify([
            'Open textbook to the relevant practice section.',
            'Complete exercises individually.',
            'Check your answers with the answer key if available.',
            'If stuck, attempt the next question and return.',
            'Write down any questions to ask the teacher later.'
          ]),
          isAiGenerated: true
        };
      }
      return {
        targetGroup: g.type,
        title: 'Guided Worksheet Practice',
        objective: 'Practice with scaffolded problems that build confidence step by step.',
        materials: 'Guided worksheet (provided by teacher), pencil',
        steps: JSON.stringify([
          'Read the worked example at the top of the worksheet.',
          'Complete Section A (easiest) first.',
          'Move to Section B when comfortable.',
          'Circle any problem you are unsure about.',
          'Compare answers with a partner when done.'
        ]),
        isAiGenerated: true
      };
    });
  },

  generateQuickCheckQuestions: async (skill: string, count: number): Promise<MockQuestion[]> => {
    const templates: Record<string, MockQuestion[]> = {
      'Addition/Subtraction Regrouping': [
        { text: 'Quick Check: 504 − 289 = ?', type: 'mcq', optionA: '215', optionB: '225', optionC: '315', optionD: '325', correctAnswer: 'A', explanation: '504−289=215', difficulty: 'medium', isAiGenerated: true },
        { text: 'Quick Check: 300 − 145 = ?', type: 'mcq', optionA: '145', optionB: '155', optionC: '165', optionD: '245', correctAnswer: 'B', explanation: '300−145=155', difficulty: 'easy', isAiGenerated: true },
        { text: 'Quick Check: 1,000 − 456 = ?', type: 'mcq', optionA: '444', optionB: '544', optionC: '554', optionD: '644', correctAnswer: 'B', explanation: '1000−456=544', difficulty: 'medium', isAiGenerated: true },
      ],
      'Division Facts': [
        { text: 'Quick Check: 56 ÷ 8 = ?', type: 'mcq', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'B', explanation: '56÷8=7', difficulty: 'easy', isAiGenerated: true },
        { text: 'Quick Check: 45 ÷ 9 = ?', type: 'mcq', optionA: '4', optionB: '5', optionC: '6', optionD: '7', correctAnswer: 'B', explanation: '45÷9=5', difficulty: 'easy', isAiGenerated: true },
        { text: 'Quick Check: 64 ÷ 8 = ?', type: 'mcq', optionA: '7', optionB: '8', optionC: '9', optionD: '10', correctAnswer: 'B', explanation: '64÷8=8', difficulty: 'easy', isAiGenerated: true },
      ],
    };

    const skillKey = Object.keys(templates).find(k =>
      k.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(k.toLowerCase())
    ) || 'Addition/Subtraction Regrouping';

    const bank = templates[skillKey];
    const result: MockQuestion[] = [];
    for (let i = 0; i < count; i++) {
      result.push({ ...bank[i % bank.length] });
    }
    return result;
  }
};
