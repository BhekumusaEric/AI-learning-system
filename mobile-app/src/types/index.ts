// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  learningReminders: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Content Types
export interface Ground {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  icon: string;
  color: string;
  isActive: boolean;
  estimatedTime: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ContentItem {
  id: string;
  groundId: string;
  parentId?: string;
  title: string;
  contentType: 'part' | 'chapter' | 'page' | 'project' | 'exam';
  contentPath: string;
  orderIndex: number;
  estimatedTime: number; // in minutes
  prerequisites: string[];
  isCompleted: boolean;
  progress: number; // 0-100
}

export interface ContentSection {
  type: 'markdown' | 'code_block' | 'quiz' | 'image' | 'video';
  content: string;
  metadata?: {
    language?: string;
    executable?: boolean;
    testCases?: CodeTestCase[];
    questions?: QuizQuestion[];
  };
}

export interface CodeTestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'code' | 'text_input';
  question: string;
  options?: string[];
  correctAnswer: any;
  explanation?: string;
}

// Progress and Learning Types
export interface UserProgress {
  userId: string;
  contentId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  timeSpent: number; // in seconds
  startedAt?: string;
  completedAt?: string;
  score?: number;
  attempts: number;
}

export interface LearningSession {
  id: string;
  userId: string;
  contentId: string;
  startedAt: string;
  endedAt?: string;
  timeSpent: number;
  interactions: LearningInteraction[];
}

export interface LearningInteraction {
  type: 'view' | 'code_execution' | 'quiz_attempt' | 'navigation';
  timestamp: string;
  data: any;
}

// Code Execution Types
export interface CodeSubmission {
  id: string;
  userId: string;
  contentId: string;
  code: string;
  language: string;
  submittedAt: string;
  executionResult: ExecutionResult;
  validationResult: ValidationResult;
  isCorrect: boolean;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed?: number;
}

export interface ValidationResult {
  passed: boolean;
  score: number;
  feedback: string;
  testResults: TestResult[];
}

export interface TestResult {
  testCase: string;
  passed: boolean;
  actualOutput: any;
  expectedOutput: any;
  error?: string;
}

// Assessment Types
export interface Assessment {
  id: string;
  type: 'quiz' | 'project' | 'exam';
  title: string;
  description: string;
  contentId: string;
  questions: AssessmentQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'code' | 'text' | 'diagram';
  question: string;
  options?: string[];
  correctAnswer: any;
  points: number;
  explanation: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  maxScore: number;
  answers: AssessmentAnswer[];
  startedAt: string;
  completedAt: string;
  timeSpent: number;
  passed: boolean;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: any;
  isCorrect: boolean;
  timeSpent: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  GroundSelection: undefined;
  ContentViewer: { contentId: string };
  CodePlayground: { contentId: string; initialCode?: string };
  Assessment: { assessmentId: string };
  Progress: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Learn: undefined;
  Practice: undefined;
  Progress: undefined;
};

// UI State Types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'system';
  orientation: 'portrait' | 'landscape';
}

// Offline Types
export interface OfflineContent {
  contentId: string;
  content: ContentItem;
  downloadedAt: string;
  lastAccessedAt: string;
  size: number; // in bytes
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingUploads: number;
  pendingDownloads: number;
}

// Notification Types
export interface NotificationData {
  id: string;
  type: 'reminder' | 'achievement' | 'update' | 'social';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  userId: string;
  timestamp: string;
  properties: Record<string, any>;
  sessionId: string;
}