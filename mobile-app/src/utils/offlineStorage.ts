import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentItem, UserProgress } from '../types';

const STORAGE_KEYS = {
  OFFLINE_CONTENT: 'offline_content',
  USER_PROGRESS: 'user_progress',
  CACHE_TIMESTAMP: 'cache_timestamp',
  USER_PREFERENCES: 'user_preferences',
};

class OfflineStorage {
  // Content caching
  async saveContentForOffline(contentId: string, content: ContentItem): Promise<void> {
    try {
      const existingContent = await this.getOfflineContent();
      existingContent[contentId] = {
        ...content,
        cachedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_CONTENT, JSON.stringify(existingContent));
    } catch (error) {
      console.error('Failed to save content for offline:', error);
      throw error;
    }
  }

  async getOfflineContent(): Promise<Record<string, ContentItem & { cachedAt: string }>> {
    try {
      const content = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_CONTENT);
      return content ? JSON.parse(content) : {};
    } catch (error) {
      console.error('Failed to get offline content:', error);
      return {};
    }
  }

  async getOfflineContentItem(contentId: string): Promise<ContentItem | null> {
    try {
      const content = await this.getOfflineContent();
      return content[contentId] || null;
    } catch (error) {
      console.error('Failed to get offline content item:', error);
      return null;
    }
  }

  async removeOfflineContent(contentId: string): Promise<void> {
    try {
      const existingContent = await this.getOfflineContent();
      delete existingContent[contentId];
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_CONTENT, JSON.stringify(existingContent));
    } catch (error) {
      console.error('Failed to remove offline content:', error);
      throw error;
    }
  }

  async clearAllOfflineContent(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_CONTENT);
    } catch (error) {
      console.error('Failed to clear offline content:', error);
      throw error;
    }
  }

  // Progress tracking
  async saveProgressLocally(progress: UserProgress): Promise<void> {
    try {
      const existingProgress = await this.getLocalProgress();
      existingProgress[progress.contentId] = {
        ...progress,
        synced: false,
        lastModified: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(existingProgress));
    } catch (error) {
      console.error('Failed to save progress locally:', error);
      throw error;
    }
  }

  async getLocalProgress(): Promise<Record<string, UserProgress & { synced: boolean; lastModified: string }>> {
    try {
      const progress = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return progress ? JSON.parse(progress) : {};
    } catch (error) {
      console.error('Failed to get local progress:', error);
      return {};
    }
  }

  async getUnsyncedProgress(): Promise<UserProgress[]> {
    try {
      const localProgress = await this.getLocalProgress();
      return Object.values(localProgress)
        .filter(p => !p.synced)
        .map(({ synced, lastModified, ...progress }) => progress);
    } catch (error) {
      console.error('Failed to get unsynced progress:', error);
      return [];
    }
  }

  async markProgressSynced(contentId: string): Promise<void> {
    try {
      const localProgress = await this.getLocalProgress();
      if (localProgress[contentId]) {
        localProgress[contentId].synced = true;
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(localProgress));
      }
    } catch (error) {
      console.error('Failed to mark progress as synced:', error);
      throw error;
    }
  }

  // Cache management
  async setCacheTimestamp(key: string, timestamp: number = Date.now()): Promise<void> {
    try {
      const timestamps = await this.getCacheTimestamps();
      timestamps[key] = timestamp;
      await AsyncStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMP, JSON.stringify(timestamps));
    } catch (error) {
      console.error('Failed to set cache timestamp:', error);
      throw error;
    }
  }

  async getCacheTimestamps(): Promise<Record<string, number>> {
    try {
      const timestamps = await AsyncStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);
      return timestamps ? JSON.parse(timestamps) : {};
    } catch (error) {
      console.error('Failed to get cache timestamps:', error);
      return {};
    }
  }

  async isCacheValid(key: string, maxAge: number = 24 * 60 * 60 * 1000): Promise<boolean> {
    try {
      const timestamps = await this.getCacheTimestamps();
      const cacheTime = timestamps[key];
      if (!cacheTime) return false;

      return (Date.now() - cacheTime) < maxAge;
    } catch (error) {
      console.error('Failed to check cache validity:', error);
      return false;
    }
  }

  // User preferences
  async saveUserPreferences(preferences: Record<string, any>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      throw error;
    }
  }

  async getUserPreferences(): Promise<Record<string, any>> {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {};
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return {};
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  async getStorageSize(): Promise<{ used: number; available: number }> {
    try {
      // This is a simplified estimation
      const allKeys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of allKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length * 2; // Rough estimation: 2 bytes per character
        }
      }

      // Assume 100MB available storage for mobile apps
      const availableBytes = 100 * 1024 * 1024;

      return {
        used: totalSize,
        available: availableBytes - totalSize,
      };
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return { used: 0, available: 0 };
    }
  }
}

export const offlineStorage = new OfflineStorage();
export default offlineStorage;