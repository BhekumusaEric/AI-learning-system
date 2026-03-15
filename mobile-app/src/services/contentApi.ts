import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../constants';
import { Ground, ContentItem, PaginatedResponse, ApiResponse } from '../types';

export const contentApi = createApi({
  reducerPath: 'contentApi',
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
    // Grounds
    getGrounds: builder.query<Ground[], void>({
      query: () => '/content/grounds',
    }),

    getGround: builder.query<Ground, string>({
      query: (groundId) => `/content/grounds/${groundId}`,
    }),

    // Content Items
    getContentStructure: builder.query<ContentItem[], string>({
      query: (groundId) => `/content/grounds/${groundId}/structure`,
    }),

    getContentItem: builder.query<ContentItem, string>({
      query: (contentId) => `/content/${contentId}`,
    }),

    getContentByParent: builder.query<ContentItem[], { parentId: string; page?: number; limit?: number }>({
      query: ({ parentId, page = 1, limit = 20 }) => ({
        url: '/content/items',
        params: { parentId, page, limit },
      }),
    }),

    // Search
    searchContent: builder.query<PaginatedResponse<ContentItem>, { query: string; groundId?: string; page?: number; limit?: number }>({
      query: ({ query, groundId, page = 1, limit = 20 }) => ({
        url: '/content/search',
        params: { q: query, groundId, page, limit },
      }),
    }),

    // Content Management (Admin)
    createContentItem: builder.mutation<ContentItem, Partial<ContentItem>>({
      query: (contentItem) => ({
        url: '/content',
        method: 'POST',
        body: contentItem,
      }),
    }),

    updateContentItem: builder.mutation<ContentItem, { id: string; updates: Partial<ContentItem> }>({
      query: ({ id, updates }) => ({
        url: `/content/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),

    deleteContentItem: builder.mutation<ApiResponse<null>, string>({
      query: (contentId) => ({
        url: `/content/${contentId}`,
        method: 'DELETE',
      }),
    }),

    // Content Analytics
    getContentStats: builder.query<{
      totalViews: number;
      averageCompletion: number;
      popularContent: ContentItem[];
    }, string>({
      query: (groundId) => `/content/grounds/${groundId}/stats`,
    }),

    // Offline Content
    getContentForOffline: builder.query<ContentItem[], string[]>({
      query: (contentIds) => ({
        url: '/content/offline',
        method: 'POST',
        body: { contentIds },
      }),
    }),
  }),
});

export const {
  useGetGroundsQuery,
  useGetGroundQuery,
  useGetContentStructureQuery,
  useGetContentItemQuery,
  useGetContentByParentQuery,
  useSearchContentQuery,
  useCreateContentItemMutation,
  useUpdateContentItemMutation,
  useDeleteContentItemMutation,
  useGetContentStatsQuery,
  useGetContentForOfflineQuery,
} = contentApi;