export type ReflexType = 'avoidance' | 'accommodation' | 'defense' | 'control' | 'withdrawal';

export const REFLEX_TYPES: ReflexType[] = ['avoidance', 'accommodation', 'defense', 'control', 'withdrawal'];

export interface DiagnosticAnswer {
  id: string;
  question_id: string;
  answer_label: string;
  reflex_type: ReflexType;
  score: number;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  position: number;
  answers: DiagnosticAnswer[];
}

export type ReflexScores = Record<ReflexType, number>;

export interface DiagnosticComputed {
  scores: ReflexScores;
  dominant: ReflexType;
  secondary: ReflexType | null;
  answers: { question_id: string; answer_id: string; reflex_type: ReflexType }[];
}

export interface DiagnosticResultRow {
  id: string;
  user_id: string;
  result_data: { scores: ReflexScores; answers?: DiagnosticComputed['answers'] };
  dominant_reflex: ReflexType;
  secondary_reflex: ReflexType | null;
  completed_at: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  reminder_time: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface AudioExercise {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  category: string;
  duration_seconds: number;
  is_active: boolean;
  position: number;
  created_at?: string;
}

export interface AudioScheduleRow {
  id: string;
  scheduled_date: string;
  exercise_id: string;
}

export type SessionMode = 'centering' | 'difficult_situation';
export type SessionStatus = 'started' | 'completed' | 'interrupted';
export type SessionSource = 'daily' | 'focus';

export interface DailySession {
  id: string;
  user_id: string;
  exercise_id: string | null;
  session_date: string;
  mode: SessionMode;
  source: SessionSource;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number;
  status: SessionStatus;
  created_at: string;
  audio_exercises?: { title: string } | null;
}

export type SituationContext = 'preparation' | 'focus' | 'sos';

export interface DifficultSituation {
  id: string;
  user_id: string;
  description: string;
  person_involved: string | null;
  main_concern: string | null;
  emotional_state: string | null;
  context: SituationContext;
  preparation_data: Record<string, unknown>;
  created_at: string;
}

export type Difficulty = 'debutant' | 'intermediaire' | 'avance';

export interface DojoOption {
  label: string;
  feedback: string;
  tone: 'ajuste' | 'a_explorer';
}

export interface DojoStep {
  other_says: string;
  prompt: string;
  options: DojoOption[];
}

export interface DojoContent {
  context: string;
  goal: string;
  steps: DojoStep[];
  reflection: string[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  content: DojoContent;
  estimated_duration: number;
  difficulty_level: Difficulty;
  is_active: boolean;
  created_at?: string;
}

export interface ExerciseCompletion {
  id: string;
  user_id: string;
  exercise_id: string;
  completed_at: string;
  result_data: Record<string, unknown>;
  exercises?: { title: string; category: string } | null;
}
