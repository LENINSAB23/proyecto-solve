export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  role: UserRole;
  grade_level: string;
  school_name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  preferred_learning_style?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile: UserProfile;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  icon_name: string;
  color_accent: string;
}

export interface Activity {
  id: number;
  course: number;
  title: string;
  topic: string;
  description: string;
  content_markdown: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_minutes: number;
  order: number;
  student_status?: 'pending' | 'in_progress' | 'completed';
}

export interface Course {
  id: number;
  title: string;
  description: string;
  subject: number;
  subject_details?: Subject;
  teacher: number;
  teacher_name?: string;
  grade_level: string;
  cover_image: string;
  is_active: boolean;
  activities_count?: number;
  evaluations_count?: number;
  user_progress?: number;
  activities?: Activity[];
  evaluations?: Evaluation[];
}

export interface Enrollment {
  id: number;
  student: number;
  course: Course;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused';
  enrolled_at: string;
}

export interface QuestionOption {
  id: number;
  text: string;
  is_correct?: boolean;
  feedback?: string;
}

export interface Question {
  id: number;
  evaluation: number;
  text: string;
  question_type: 'multiple_choice' | 'open_text' | 'true_false';
  options: QuestionOption[];
  explanation: string;
  points: number;
  order: number;
}

export interface Evaluation {
  id: number;
  course: number;
  course_title?: string;
  title: string;
  description: string;
  topic: string;
  duration_minutes: number;
  passing_score: number;
  total_points: number;
  questions?: Question[];
  questions_count?: number;
}

export interface StudentAnswer {
  id?: number;
  question: number;
  selected_option_index?: number;
  text_response?: string;
  is_correct: boolean;
  score_obtained: number;
  feedback: string;
}

export interface EvaluationAttempt {
  id: number;
  evaluation: number;
  evaluation_title?: string;
  topic?: string;
  student: number;
  score: number;
  passed: boolean;
  feedback: string;
  completed_at: string;
  is_offline_synced: boolean;
  answers?: StudentAnswer[];
}

export interface StudentMastery {
  id: number;
  subject: number;
  subject_name: string;
  topic: string;
  mastery_level: 'mastered' | 'standard_met' | 'nearly_met' | 'needs_reinforcement';
  score_average: number;
  evaluations_count: number;
  strengths: string;
  areas_to_improve: string;
}

export interface LearningRecommendation {
  id: number;
  title: string;
  description: string;
  topic: string;
  action_type: 'tutor_session' | 'practice_exercise' | 'lesson_review' | 'evaluation';
  priority: 'high' | 'medium' | 'low';
  is_completed: boolean;
  created_at: string;
}

export type TutorMode = 'simple' | 'detailed' | 'practical' | 'step_by_step' | 'practice_quiz';

export interface AIMessage {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  suggested_followups?: string[];
  timestamp?: string;
  is_demo_generated?: boolean;
}

export interface AITutorSession {
  id: number;
  title: string;
  mode: TutorMode;
  topic: string;
  created_at: string;
  messages?: AIMessage[];
}

export interface TeacherAIGeneration {
  id: number;
  generation_type: 'quiz' | 'lesson_plan' | 'exercise' | 'activity_prompt';
  subject: string;
  topic: string;
  grade_level: string;
  prompt: string;
  result_data: any;
  created_at: string;
}

export interface StudentDashboardData {
  greeting: string;
  grade_level: string;
  school_name: string;
  courses: Enrollment[];
  active_courses_count: number;
  completed_activities_count: number;
  average_score: number;
  streak_days: number;
  study_hours: number;
  mastery_stats: {
    mastered: number;
    standard_met: number;
    nearly_met: number;
    needs_reinforcement: number;
  };
  recommendations: LearningRecommendation[];
  pending_activities: Activity[];
  recent_attempts: EvaluationAttempt[];
}
