export interface Question {
  id: number;
  category: string; // e.g. "Vocabulary", "Grammar", "Phrasal Verbs", "Idioms"
  level: "Beginner" | "Intermediate" | "Advanced";
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  hint?: string;
}

export type DipState = 'idle' | 'dipping in' | 'revealing-correct' | 'revealing-incorrect';

export interface UserAnswer {
  questionId: number;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}
