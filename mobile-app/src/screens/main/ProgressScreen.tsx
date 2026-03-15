import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import {
  useGetUserProgressQuery,
  useGetLearningAnalyticsQuery,
  useGetAchievementsQuery,
} from '../../services/progressApi';
import { Card, LoadingSpinner, ErrorMessage } from '../../components/common';
import { COLORS, LEARNING_GROUNDS } from '../../constants';

const { width } = Dimensions.get('window');

const ProgressScreen: React.FC = () => {
  const theme = useTheme();

  const { data: progress, isLoading: progressLoading, error: progressError } = useGetUserProgressQuery();
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useGetLearningAnalyticsQuery({});
  const { data: achievements, isLoading: achievementsLoading, error: achievementsError } = useGetAchievementsQuery();

  const isLoading = progressLoading || analyticsLoading || achievementsLoading;
  const error = progressError || analyticsError || achievementsError;

  const completedCount = progress?.filter(p => p.status === 'completed').length || 0;
  const inProgressCount = progress?.filter(p => p.status === 'in_progress').length || 0;
  const totalCount = progress?.length || 0;

  const renderProgressStats = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Text style={[styles.statNumber, { color: COLORS.success }]}>{completedCount}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Completed</Text>
      </Card>

      <Card style={styles.statCard}>
        <Text style={[styles.statNumber, { color: COLORS.primary }]}>{inProgressCount}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>In Progress</Text>
      </Card>

      <Card style={styles.statCard}>
        <Text style={[styles.statNumber, { color: COLORS.secondary }]}>{totalCount}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>Total Started</Text>
      </Card>
    </View>
  );

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Learning Analytics
        </Text>

        <Card style={styles.analyticsCard}>
          <View style={styles.analyticsRow}>
            <Text style={[styles.analyticsLabel, { color: theme.colors.onSurfaceVariant }]}>
              Total Time Spent
            </Text>
            <Text style={[styles.analyticsValue, { color: theme.colors.onSurface }]}>
              {Math.round(analytics.totalTimeSpent / 60)} hours
            </Text>
          </View>

          <View style={styles.analyticsRow}>
            <Text style={[styles.analyticsLabel, { color: theme.colors.onSurfaceVariant }]}>
              Average Score
            </Text>
            <Text style={[styles.analyticsValue, { color: theme.colors.onSurface }]}>
              {Math.round(analytics.averageScore)}%
            </Text>
          </View>

          <View style={styles.analyticsRow}>
            <Text style={[styles.analyticsLabel, { color: theme.colors.onSurfaceVariant }]}>
              Learning Streak
            </Text>
            <Text style={[styles.analyticsValue, { color: theme.colors.onSurface }]}>
              {analytics.learningStreak} days
            </Text>
          </View>
        </Card>

        <Text style={[styles.subsectionTitle, { color: theme.colors.onSurface }]}>
          Progress by Ground
        </Text>

        {Object.entries(analytics.progressByGround).map(([groundId, groundProgress]) => {
          const ground = LEARNING_GROUNDS.find(g => g.id === groundId);
          const progressPercent = groundProgress.total > 0 ? (groundProgress.completed / groundProgress.total) * 100 : 0;

          return (
            <Card key={groundId} style={styles.groundProgressCard}>
              <View style={styles.groundProgressHeader}>
                <Text style={[styles.groundEmoji]}>{ground?.emoji || '🎯'}</Text>
                <View style={styles.groundProgressInfo}>
                  <Text style={[styles.groundProgressTitle, { color: theme.colors.onSurface }]}>
                    {ground?.title || groundId}
                  </Text>
                  <Text style={[styles.groundProgressStats, { color: theme.colors.onSurfaceVariant }]}>
                    {groundProgress.completed}/{groundProgress.total} completed
                  </Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%`, backgroundColor: COLORS.primary },
                  ]}
                />
              </View>
            </Card>
          );
        })}
      </View>
    );
  };

  const renderAchievements = () => {
    if (!achievements) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Achievements
        </Text>

        <View style={styles.achievementsContainer}>
          {achievements.earned.map((achievement) => (
            <Card key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: theme.colors.onSurface }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDesc, { color: theme.colors.onSurfaceVariant }]}>
                    {achievement.description}
                  </Text>
                  <Text style={[styles.achievementDate, { color: COLORS.primary }]}>
                    Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </Card>
          ))}

          {achievements.available.slice(0, 3).map((achievement) => (
            <Card key={achievement.id} style={[styles.achievementCard, styles.lockedAchievement]}>
              <View style={styles.achievementContent}>
                <Text style={[styles.achievementEmoji, styles.lockedEmoji]}>🔒</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: theme.colors.onSurfaceVariant }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDesc, { color: theme.colors.onSurfaceVariant }]}>
                    {achievement.description}
                  </Text>
                  <Text style={[styles.achievementProgress, { color: COLORS.primary }]}>
                    {Math.round(achievement.progress * 100)}% complete
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner text="Loading your progress..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage
          message="Failed to load progress data."
          showRetryButton={false}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Your Progress
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Track your learning journey
        </Text>
      </View>

      {renderProgressStats()}
      {renderAnalytics()}
      {renderAchievements()}
    </ScrollView>
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    padding: 24,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  analyticsCard: {
    padding: 16,
    marginBottom: 16,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  analyticsLabel: {
    fontSize: 16,
  },
  analyticsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  groundProgressCard: {
    padding: 16,
    marginBottom: 8,
  },
  groundProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groundEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  groundProgressInfo: {
    flex: 1,
  },
  groundProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  groundProgressStats: {
    fontSize: 14,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsContainer: {
    marginTop: 8,
  },
  achievementCard: {
    marginBottom: 8,
    padding: 16,
  },
  lockedAchievement: {
    opacity: 0.7,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  lockedEmoji: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
  },
  achievementDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  achievementProgress: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProgressScreen;