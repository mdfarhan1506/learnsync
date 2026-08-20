export const indianStudentNames = [
  "Aarav Patel", "Diya Sharma", "Vihaan Singh", "Anya Gupta", "Arjun Kumar",
  "Riya Desai", "Sai Reddy", "Isha Joshi", "Krishna Iyer", "Neha Verma",
  "Kabir Malhotra", "Avni Rao", "Rudra Nair", "Myra Kapoor", "Ishaan Menon",
  "Sia Bhatia", "Aaryan Pillai", "Ananya Das", "Atharva Banerjee", "Kavya Bose",
  "Vivaan Chatterjee", "Meera Mukherjee", "Rohan Sen", "Tara Ghosh", "Advik Mahajan",
  "Navya Ahluwalia", "Dev Choudhury", "Pari Ahuja", "Shaurya Jain", "Sara Mehta",
  "Dhruv Agarwal", "Aisha Sethi", "Ayaan Chawla", "Anika Kaur", "Kabir Bedi",
  "Roshni Bajaj", "Karan Nanda", "Shruti Dewan", "Aryan Thakur", "Nandini Raj"
];

export const demoSkills = [
  {
    name: "Place Value",
    grade: "Grade 5",
    subject: "Math",
    description: "Understanding value of digits up to 1,000,000",
    prerequisites: []
  },
  {
    name: "Multiplication Facts",
    grade: "Grade 4",
    subject: "Math",
    description: "Fluency with multiplication tables up to 12x12",
    prerequisites: []
  },
  {
    name: "Division Facts",
    grade: "Grade 4",
    subject: "Math",
    description: "Fluency with basic division facts",
    prerequisites: []
  },
  {
    name: "Addition/Subtraction Regrouping",
    grade: "Grade 4",
    subject: "Math",
    description: "Adding and subtracting multi-digit numbers with regrouping",
    prerequisites: ["Place Value"]
  },
  {
    name: "Multi-digit Multiplication",
    grade: "Grade 5",
    subject: "Math",
    description: "Multiplying multi-digit numbers using standard algorithm",
    prerequisites: ["Place Value", "Multiplication Facts"]
  },
  {
    name: "Basic Division",
    grade: "Grade 5",
    subject: "Math",
    description: "Dividing multi-digit numbers by 1-digit divisors",
    prerequisites: ["Division Facts", "Multiplication Facts", "Addition/Subtraction Regrouping"]
  }
];

export const diagnosticQuestions = [
  // Place Value (3 questions)
  { text: "What is the value of 7 in 4,732,100?", skill: "Place Value", options: ["700", "7,000", "70,000", "700,000"], correct: "D", diff: "easy" },
  { text: "Which number has a 5 in the ten-thousands place?", skill: "Place Value", options: ["1,050,000", "5,200,000", "154,320", "10,500"], correct: "C", diff: "medium" },
  { text: "Write 40,000 + 3,000 + 20 + 9 in standard form.", skill: "Place Value", options: ["43,029", "40,329", "43,290", "4,329"], correct: "A", diff: "medium" },

  // Multiplication Facts (3 questions)
  { text: "8 × 7 = ?", skill: "Multiplication Facts", options: ["54", "56", "64", "48"], correct: "B", diff: "easy" },
  { text: "9 × 6 = ?", skill: "Multiplication Facts", options: ["54", "56", "63", "64"], correct: "A", diff: "easy" },
  { text: "12 × 9 = ?", skill: "Multiplication Facts", options: ["96", "108", "112", "120"], correct: "B", diff: "medium" },

  // Division Facts (3 questions)
  { text: "42 ÷ 6 = ?", skill: "Division Facts", options: ["6", "7", "8", "9"], correct: "B", diff: "easy" },
  { text: "63 ÷ 9 = ?", skill: "Division Facts", options: ["6", "7", "8", "9"], correct: "B", diff: "easy" },
  { text: "56 ÷ 8 = ?", skill: "Division Facts", options: ["6", "7", "8", "9"], correct: "B", diff: "medium" },

  // Addition/Subtraction Regrouping (4 questions)
  { text: "342 + 189 = ?", skill: "Addition/Subtraction Regrouping", options: ["521", "531", "431", "421"], correct: "B", diff: "easy" },
  { text: "502 - 176 = ?", skill: "Addition/Subtraction Regrouping", options: ["326", "336", "426", "226"], correct: "A", diff: "medium" },
  { text: "4,000 - 1,245 = ?", skill: "Addition/Subtraction Regrouping", options: ["2,755", "3,755", "2,855", "3,855"], correct: "A", diff: "hard" },
  { text: "7,894 + 3,456 = ?", skill: "Addition/Subtraction Regrouping", options: ["10,350", "11,250", "11,350", "10,250"], correct: "C", diff: "hard" },

  // Multi-digit Multiplication (3 questions)
  { text: "34 × 5 = ?", skill: "Multi-digit Multiplication", options: ["170", "150", "160", "180"], correct: "A", diff: "easy" },
  { text: "123 × 4 = ?", skill: "Multi-digit Multiplication", options: ["482", "492", "502", "392"], correct: "B", diff: "medium" },
  { text: "45 × 12 = ?", skill: "Multi-digit Multiplication", options: ["540", "520", "640", "440"], correct: "A", diff: "hard" },

  // Basic Division (4 questions)
  { text: "84 ÷ 4 = ?", skill: "Basic Division", options: ["21", "22", "24", "12"], correct: "A", diff: "easy" },
  { text: "125 ÷ 5 = ?", skill: "Basic Division", options: ["15", "25", "35", "45"], correct: "B", diff: "medium" },
  { text: "432 ÷ 6 = ?", skill: "Basic Division", options: ["62", "72", "82", "92"], correct: "B", diff: "hard" },
  { text: "301 ÷ 7 = ?", skill: "Basic Division", options: ["33", "43", "53", "63"], correct: "B", diff: "hard" }
]; // Total 20 questions
