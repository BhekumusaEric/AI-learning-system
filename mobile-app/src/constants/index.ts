// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3001/api'
    : 'https://api.ioai-training-grounds.com/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes
} as const;

// Content Types
export const CONTENT_TYPES = {
  PART: 'part',
  CHAPTER: 'chapter',
  PAGE: 'page',
  PROJECT: 'project',
  EXAM: 'exam',
} as const;

// Assessment Types
export const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  PROJECT: 'project',
  EXAM: 'exam',
} as const;

// Learning Status
export const LEARNING_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

// Code Languages
export const SUPPORTED_LANGUAGES = {
  PYTHON: 'python',
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
  JAVA: 'java',
  CPP: 'cpp',
  CSHARP: 'csharp',
  GO: 'go',
  RUST: 'rust',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  PAGINATION_SIZE: 20,
  MAX_RETRY_ATTEMPTS: 3,
  OFFLINE_STORAGE_LIMIT: 500 * 1024 * 1024, // 500MB
} as const;

// Learning Grounds
export const LEARNING_GROUNDS = [
  {
    id: 'fundamentals',
    title: 'AI Fundamentals',
    description: 'Master the core concepts of artificial intelligence and machine learning',
    icon: 'brain',
    color: '#3B82F6',
    difficulty: 'beginner',
    estimatedTime: 40,
    parts: ['part1_machine_learning_basics', 'part2_neural_networks', 'part3_deep_learning'],
  },
  {
    id: 'computer_vision',
    title: 'Computer Vision',
    description: 'Learn image processing, CNNs, and visual AI applications',
    icon: 'eye',
    color: '#10B981',
    difficulty: 'intermediate',
    estimatedTime: 35,
    parts: ['part4_computer_vision', 'part5_advanced_cv'],
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    description: 'Explore text analysis, transformers, and language AI',
    icon: 'message-square',
    color: '#F59E0B',
    difficulty: 'intermediate',
    estimatedTime: 30,
    parts: ['part6_nlp_basics', 'part7_advanced_nlp'],
  },
  {
    id: 'projects',
    title: 'Practical Projects',
    description: 'Build real-world AI applications and systems',
    icon: 'code',
    color: '#EF4444',
    difficulty: 'advanced',
    estimatedTime: 60,
    parts: ['part5_projects_and_assessment'],
  },
] as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: {
    label: 'Beginner',
    color: '#10B981',
    description: 'Perfect for those new to AI/ML',
  },
  INTERMEDIATE: {
    label: 'Intermediate',
    color: '#F59E0B',
    description: 'Requires basic AI knowledge',
  },
  ADVANCED: {
    label: 'Advanced',
    color: '#EF4444',
    description: 'For experienced practitioners',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  OFFLINE_ERROR: 'This feature requires an internet connection.',
  CODE_EXECUTION_ERROR: 'Code execution failed. Please check your code and try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back! You\'re now logged in.',
  PROGRESS_SAVED: 'Your progress has been saved.',
  ASSESSMENT_COMPLETED: 'Assessment completed successfully!',
  CODE_EXECUTED: 'Code executed successfully.',
  CONTENT_DOWNLOADED: 'Content downloaded for offline access.',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  APP_SETTINGS: 'app_settings',
  OFFLINE_CONTENT: 'offline_content',
  LEARNING_PROGRESS: 'learning_progress',
  CACHE_TIMESTAMP: 'cache_timestamp',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement',
  UPDATE: 'update',
  SOCIAL: 'social',
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  APP_OPEN: 'app_open',
  LOGIN: 'login',
  LOGOUT: 'logout',
  CONTENT_VIEW: 'content_view',
  CODE_EXECUTION: 'code_execution',
  ASSESSMENT_START: 'assessment_start',
  ASSESSMENT_COMPLETE: 'assessment_complete',
  PROGRESS_UPDATE: 'progress_update',
  OFFLINE_DOWNLOAD: 'offline_download',
} as const;

// Feature Flags (for gradual rollout)
export const FEATURE_FLAGS = {
  OFFLINE_MODE: true,
  CODE_EXECUTION: true,
  ADVANCED_ANALYTICS: false,
  SOCIAL_FEATURES: false,
  AI_TUTORING: false,
} as const;