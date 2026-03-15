import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { useGetContentItemQuery, useUpdateProgressMutation } from '../../services/contentApi';
import { Card, LoadingSpinner, ErrorMessage, Button } from '../../components/common';
import { COLORS } from '../../constants';
import { ContentItem } from '../../types';

const { width } = Dimensions.get('window');

const ContentViewerScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const { contentId, groundId } = route.params as { contentId: string; groundId: string };

  const { data: content, isLoading, error, refetch } = useGetContentItemQuery(contentId);
  const [updateProgress] = useUpdateProgressMutation();

  const [startTime, setStartTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000 / 60)); // minutes
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [startTime]);

  const handleComplete = async () => {
    try {
      await updateProgress({
        contentId,
        progressPercentage: 100,
        timeSpent: timeSpent,
        status: 'completed',
      }).unwrap();

      Alert.alert(
        'Congratulations!',
        'You have completed this lesson!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update progress. Please try again.');
    }
  };

  const handleMarkInProgress = async () => {
    try {
      await updateProgress({
        contentId,
        progressPercentage: Math.max(content?.progress?.progressPercentage || 0, 10),
        timeSpent: timeSpent,
        status: 'in_progress',
      }).unwrap();
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const renderContent = () => {
    if (!content) return null;

    switch (content.type) {
      case 'text':
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.contentText, { color: theme.colors.onSurface }]}>
              {content.content}
            </Text>
          </View>
        );

      case 'code':
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Code Example
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                {content.content}
              </Text>
            </View>
          </View>
        );

      case 'quiz':
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quiz
            </Text>
            <Text style={[styles.quizQuestion, { color: theme.colors.onSurface }]}>
              {content.content}
            </Text>
            {/* Quiz options would be rendered here */}
            <Text style={[styles.noteText, { color: theme.colors.onSurfaceVariant }]}>
              Quiz functionality coming soon...
            </Text>
          </View>
        );

      case 'video':
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Video Content
            </Text>
            <View style={styles.videoPlaceholder}>
              <Text style={[styles.placeholderText, { color: theme.colors.onSurfaceVariant }]}>
                🎥 Video: {content.title}
              </Text>
              <Text style={[styles.noteText, { color: theme.colors.onSurfaceVariant }]}>
                Video player coming soon...
              </Text>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={[styles.contentText, { color: theme.colors.onSurface }]}>
              {content.content}
            </Text>
          </View>
        );
    }
  };

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

  if (!content) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage
          message="Content not found."
          showRetryButton={false}
        />
      </View>
    );
  }

  const progressPercentage = content.progress?.progressPercentage || 0;
  const isCompleted = content.progress?.status === 'completed';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {content.title}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%`, backgroundColor: COLORS.primary },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
            {progressPercentage}% complete • {timeSpent} min spent
          </Text>
        </View>

        {renderContent()}

        <View style={styles.actions}>
          {!isCompleted && (
            <Button
              title="Mark as In Progress"
              onPress={handleMarkInProgress}
              variant="outline"
              style={styles.actionButton}
            />
          )}
          <Button
            title={isCompleted ? "Completed ✓" : "Mark as Complete"}
            onPress={handleComplete}
            disabled={isCompleted}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
  },
  contentContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  codeBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: COLORS.primary,
  },
  quizQuestion: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 24,
  },
  videoPlaceholder: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholderText: {
    fontSize: 18,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actions: {
    padding: 24,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    marginVertical: 4,
  },
});

export default ContentViewerScreen;