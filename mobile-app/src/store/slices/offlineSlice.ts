import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfflineContent, SyncStatus } from '../../types';

interface OfflineState {
  downloadedContent: Record<string, OfflineContent>;
  syncStatus: SyncStatus;
  storageUsed: number; // in bytes
  maxStorage: number; // in bytes
}

const initialState: OfflineState = {
  downloadedContent: {},
  syncStatus: {
    isOnline: true,
    lastSync: null,
    pendingUploads: 0,
    pendingDownloads: 0,
  },
  storageUsed: 0,
  maxStorage: 500 * 1024 * 1024, // 500MB
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    addDownloadedContent: (state, action: PayloadAction<OfflineContent>) => {
      const content = action.payload;
      state.downloadedContent[content.contentId] = content;
      state.storageUsed += content.size;
    },
    removeDownloadedContent: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      if (state.downloadedContent[contentId]) {
        state.storageUsed -= state.downloadedContent[contentId].size;
        delete state.downloadedContent[contentId];
      }
    },
    updateSyncStatus: (state, action: PayloadAction<Partial<SyncStatus>>) => {
      state.syncStatus = { ...state.syncStatus, ...action.payload };
    },
    setStorageLimit: (state, action: PayloadAction<number>) => {
      state.maxStorage = action.payload;
    },
    clearAllOfflineContent: (state) => {
      state.downloadedContent = {};
      state.storageUsed = 0;
    },
    updateContentAccessTime: (state, action: PayloadAction<{ contentId: string; timestamp: string }>) => {
      const { contentId, timestamp } = action.payload;
      if (state.downloadedContent[contentId]) {
        state.downloadedContent[contentId].lastAccessedAt = timestamp;
      }
    },
  },
});

export const {
  addDownloadedContent,
  removeDownloadedContent,
  updateSyncStatus,
  setStorageLimit,
  clearAllOfflineContent,
  updateContentAccessTime,
} = offlineSlice.actions;

export default offlineSlice.reducer;