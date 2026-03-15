import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { useGetGroundContentQuery, useUpdateProgressMutation } from '../../services/contentApi';
import { Card, LoadingSpinner, ErrorMessage, Button } from '../../components/common';
import { COLORS, LEARNING_GROUNDS } from '../../constants';
import { ContentItem } from '../../types';

const ContentListScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const { groundId } = route.params as { groundId: string };

  const { data: content, isLoading, error, refetch } = useGetGroundContentQuery(groundId);
  const [updateProgress] = useUpdateProgressMutation();

  const groundConfig = LEARNING_GROUNDS.find(g => g.id === groundId);

  const handleContentPress = async (contentItem: ContentItem) => {
    // Mark as started if not already
    if (contentItem.progress?.status !== 'in_progress' && contentItem.progress?.status !== 'completed') {
      try {
        await updateProgress({
          contentId: contentItem.id,
          progressPercentage: 0,
          timeSpent: 0,
          status: 'in_progress',
        }).unwrap();
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }

    // Navigate to content viewer
    navigation.navigate('ContentViewer' as never, {
      contentId: contentItem.id,
      groundId,
    } as never);
  };

  const getProgressColor = (progress?: { status: string; progressPercentage: number }) => {
    if (!progress) return COLORS.textSecondary;
    if (progress.status === 'completed') return COLORS.success;
    if (progress.status === 'in_progress') return COLORS.primary;
    return COLORS.textSecondary;
  };

  const getProgressText = (progress?: { status: string; progressPercentage: number }) => {
    if (!progress) return 'Not started';
    if (progress.status === 'completed') return 'Completed';
    if (progress.status === 'in_progress') return `${Math.round(progress.progressPercentage)}%`;
    return 'Not started';
  };

  const renderContentItem = ({ item }: { item: ContentItem }) => (
    <Card
      style={styles.contentCard}
      onPress={() => handleContentPress(item)}
      elevation={2}
    >
      <View style={styles.contentHeader}>
        <View style={styles.contentInfo}>
          <Text style={[styles.contentTitle, { color: theme.colors.onSurface }]}>
            {item.title}
          </Text>
          <Text style={[styles.contentType, { color: COLORS.primary }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: getProgressColor(item.progress) }]}>
            {getProgressText(item.progress)}
          </Text>
        </View>
      </View>

      <Text style={[styles.contentDescription, { color: theme.colors.onSurfaceVariant }]}>
        {item.description}
      </Text>

      <View style={styles.contentMeta}>
        <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
          Difficulty: {item.difficulty}
        </Text>
        <Text style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}>
          Est. time: {item.estimatedTime} min
        </Text>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner text="Loading content..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage
          message="Failed to load content. Please check your connection."
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.groundInfo}>
          <Text style={[styles.emoji, { color: theme.colors.onSurface }]}>
            {groundConfig?.emoji || '🎯'}
          </Text>
          <View style={styles.groundText}>
            <Text style={[styles.groundTitle, { color: theme.colors.onSurface }]}>
              {groundConfig?.title || 'Learning Ground'}
            </Text>
            <Text style={[styles.groundSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              {content?.length || 0} lessons available
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={content}
        renderItem={renderContentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No content available for this ground yet.
            </Text>
            <Button
              title="Refresh"
              onPress={refetch}
              variant="outline"
              size="small"
              style={styles.refreshButton}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  groundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  groundText: {
    flex: 1,
  },
  groundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groundSubtitle: {
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contentCard: {
    marginVertical: 6,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contentInfo: {
    flex: 1,
    marginRight: 12,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentType: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    marginTop: 8,
  },
});

export default ContentListScreen;