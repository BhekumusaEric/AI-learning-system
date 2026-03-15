import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../constants';
import { UserProgress, AssessmentResult, ApiResponse } from '../types';

interface ProgressUpdateRequest {
  contentId: string;
  progressPercentage: number;
  timeSpent: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}

interface AssessmentSubmission {
  assessmentId: string;
  answers: Record<string, any>;
  timeSpent: number;
}

interface LearningAnalytics {
  totalTimeSpent: number;
  completedContent: number;
  averageScore: number;
  learningStreak: number;
  achievements: string[];
  progressByGround: Record<string, {
    completed: number;
    total: number;
    averageScore: number;
  }>;
}

export const progressApi = createApi({
  reducerPath: 'progressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Progress Tracking
    getUserProgress: builder.query<UserProgress[], void>({
      query: () => '/progress/user',
      providesTags: ['Progress'],
    }),

    getContentProgress: builder.query<UserProgress, string>({
      query: (contentId) => `/progress/content/${contentId}`,
      providesTags: ['Progress'],
    }),

    updateProgress: builder.mutation<UserProgress, ProgressUpdateRequest>({
      query: (progressData) => ({
        url: '/progress/update',
        method: 'POST',
        body: progressData,
      }),
      invalidatesTags: ['Progress'],
    }),

    markContentComplete: builder.mutation<UserProgress, string>({
      query: (contentId) => ({
        url: `/progress/complete/${contentId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Progress'],
    }),

    // Assessment Results
    getAssessmentResults: builder.query<AssessmentResult[], { assessmentType?: string; limit?: number }>({
      query: ({ assessmentType, limit = 50 }) => ({
        url: '/progress/assessments',
        params: { type: assessmentType, limit },
      }),
      providesTags: ['Assessments'],
    }),

    getAssessmentResult: builder.query<AssessmentResult, string>({
      query: (assessmentId) => `/progress/assessments/${assessmentId}`,
      providesTags: ['Assessments'],
    }),

    submitAssessment: builder.mutation<AssessmentResult, AssessmentSubmission>({
      query: (submission) => ({
        url: '/progress/assessments/submit',
        method: 'POST',
        body: submission,
      }),
      invalidatesTags: ['Assessments', 'Progress'],
    }),

    // Learning Analytics
    getLearningAnalytics: builder.query<LearningAnalytics, { startDate?: string; endDate?: string }>({
      query: ({ startDate, endDate }) => ({
        url: '/progress/analytics',
        params: { startDate, endDate },
      }),
    }),

    getGroundProgress: builder.query<{
      groundId: string;
      completed: number;
      total: number;
      progressPercentage: number;
      estimatedTimeRemaining: number;
    }, string>({
      query: (groundId) => `/progress/grounds/${groundId}`,
    }),

    // Learning Sessions
    startLearningSession: builder.mutation<{ sessionId: string }, { contentId: string }>({
      query: (data) => ({
        url: '/progress/sessions/start',
        method: 'POST',
        body: data,
      }),
    }),

    endLearningSession: builder.mutation<ApiResponse<null>, { sessionId: string; timeSpent: number }>({
      query: (data) => ({
        url: '/progress/sessions/end',
        method: 'POST',
        body: data,
      }),
    }),

    // Achievements and Badges
    getAchievements: builder.query<{
      earned: Array<{ id: string; title: string; description: string; earnedAt: string; icon: string }>;
      available: Array<{ id: string; title: string; description: string; progress: number; icon: string }>;
    }, void>({
      query: () => '/progress/achievements',
    }),

    // Study Plans and Goals
    createStudyPlan: builder.mutation<{ planId: string }, {
      title: string;
      description: string;
      targetDate: string;
      contentIds: string[];
      dailyGoal: number; // minutes
    }>({
      query: (plan) => ({
        url: '/progress/study-plans',
        method: 'POST',
        body: plan,
      }),
    }),

    getStudyPlans: builder.query<Array<{
      id: string;
      title: string;
      progress: number;
      targetDate: string;
      isCompleted: boolean;
    }>, void>({
      query: () => '/progress/study-plans',
    }),

    // Recommendations
    getRecommendedContent: builder.query<Array<{
      contentId: string;
      title: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }>, { limit?: number }>({
      query: ({ limit = 10 }) => `/progress/recommendations?limit=${limit}`,
    }),
  }),
});

export const {
  useGetUserProgressQuery,
  useGetContentProgressQuery,
  useUpdateProgressMutation,
  useMarkContentCompleteMutation,
  useGetAssessmentResultsQuery,
  useGetAssessmentResultQuery,
  useSubmitAssessmentMutation,
  useGetLearningAnalyticsQuery,
  useGetGroundProgressQuery,
  useStartLearningSessionMutation,
  useEndLearningSessionMutation,
  useGetAchievementsQuery,
  useCreateStudyPlanMutation,
  useGetStudyPlansQuery,
  useGetRecommendedContentQuery,
} = progressApi;