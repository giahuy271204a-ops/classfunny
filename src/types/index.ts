export interface Student {
  id: string;
  name: string;
  code?: string;
  gender?: 'male' | 'female' | 'other';
  notes?: string;
  isAbsent?: boolean;
}

export interface ClassRoom {
  id: string;
  name: string;
  subject: string;
  schoolYear: string;
  students: Student[];
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  color: string;
  emoji: string;
  students: Student[];
}

export interface TeamScore {
  id: string;
  name: string;
  color: string;
  emoji: string;
  score: number;
}

export type QuestionType =
  | 'multiple'
  | 'boolean'
  | 'input'
  | 'multiple-choice'
  | 'true-false'
  | 'short-answer'
  | 'fill-blank'
  | 'matching'
  | 'ordering'
  | 'multiple-answer'
  | 'image-question';

export interface MatchingPairItem {
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  category: string; // môn học hoặc danh mục
  subject?: string; // môn học: Tin học, Toán, v.v.
  chapter?: string; // chương
  topic?: string; // chủ đề
  tags?: string[];
  type: QuestionType;
  question: string;
  options?: string[]; // for multiple choice / multiple answer
  answer: string | number | boolean | number[] | string[]; // index or text or true/false or array
  matchingPairs?: MatchingPairItem[]; // for matching type
  orderItems?: string[]; // for ordering type
  explanation?: string;
  hint?: string;
  points: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  isFavorite?: boolean;
  setId?: string;
  createdAt?: number;
}

export interface QuestionSet {
  id: string;
  name: string;
  subject: string;
  description?: string;
  tags?: string[];
  questionIds?: string[];
  createdAt: number;
  questionCount?: number;
}

export interface GameSetupConfig {
  gameId: string;
  gameName: string;
  source: 'all' | 'set' | 'random' | 'default';
  setId?: string;
  questionCount: number;
  difficulties: ('easy' | 'medium' | 'hard')[];
  randomQuestions: boolean;
  randomOrder: boolean;
  randomOptions: boolean;
  timePerQuestion: number; // 0 = no limit
  pointsCorrect: number;
  pointsWrong: number;
  selectedTeamIds?: string[];
}

export interface GamePreset {
  id: string;
  name: string;
  gameId: string;
  config: GameSetupConfig;
  createdAt: number;
}

export interface WordGuessItem {
  id: string;
  word: string;
  topic: string;
  clues: string[];
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface ChallengeItem {
  id: string;
  roll: number;
  title: string;
  description: string;
  type: 'reward' | 'quiz' | 'fun' | 'action';
  points?: number;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  classId: string;
  className: string;
  actionType: 'random_student' | 'groups_created' | 'game_played' | 'score_update' | 'random_order';
  title: string;
  details?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  sound: boolean;
  soundEnabled?: boolean;
  animation: boolean;
  confettiEnabled?: boolean;
  language: 'vi' | 'en';
  activeClassId: string;
  presentationMode: boolean;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  classes: ClassRoom[];
  scores: TeamScore[];
  questions: QuizQuestion[];
  questionSets?: QuestionSet[];
  gamePresets?: GamePreset[];
  activityLogs: ActivityLog[];
  settings: Partial<AppSettings>;
}
