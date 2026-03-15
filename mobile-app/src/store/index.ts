import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../services/authApi';
import { contentApi } from '../services/contentApi';
import { progressApi } from '../services/progressApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import offlineReducer from './slices/offlineSlice';

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
    [progressApi.reducerPath]: progressApi.reducer,

    // Custom slices
    auth: authReducer,
    ui: uiReducer,
    offline: offlineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(authApi.middleware)
      .concat(contentApi.middleware)
      .concat(progressApi.middleware),
  devTools: __DEV__,
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;