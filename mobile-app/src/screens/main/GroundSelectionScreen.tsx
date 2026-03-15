import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useGetGroundsQuery } from '../../services/contentApi';
import { Card, LoadingSpinner, ErrorMessage } from '../../components/common';
import { COLORS, LEARNING_GROUNDS } from '../../constants';
import { Ground } from '../../types';

const GroundSelectionScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { data: grounds, isLoading, error, refetch } = useGetGroundsQuery();

  const handleGroundPress = (ground: Ground) => {
    navigation.navigate('ContentList' as never, { groundId: ground.id } as never);
  };

  const renderGroundItem = ({ item }: { item: Ground }) => {
    const groundConfig = LEARNING_GROUNDS.find(g => g.id === item.id);

    return (
      <Card
        style={styles.groundCard}
        onPress={() => handleGroundPress(item)}
        elevation={3}
      >
        <View style={styles.groundContent}>
          <View style={styles.groundIcon}>
            <Text style={styles.groundEmoji}>{groundConfig?.emoji || '🎯'}</Text>
          </View>
          <View style={styles.groundInfo}>
            <Text style={[styles.groundTitle, { color: theme.colors.onSurface }]}>
              {item.title}
            </Text>
            <Text style={[styles.groundDescription, { color: theme.colors.onSurfaceVariant }]}>
              {item.description}
            </Text>
            <View style={styles.groundStats}>
              <Text style={[styles.statText, { color: COLORS.primary }]}>
                {item.contentCount} lessons
              </Text>
              <Text style={[styles.statText, { color: theme.colors.onSurfaceVariant }]}>
                •
              </Text>
              <Text style={[styles.statText, { color: COLORS.secondary }]}>
                {item.difficulty}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner text="Loading learning grounds..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage
          message="Failed to load learning grounds. Please check your connection."
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Choose Your Ground
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Select a learning path to begin your AI journey
        </Text>
      </View>

      <FlatList
        data={grounds}
        renderItem={renderGroundItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No learning grounds available at the moment.
            </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  groundCard: {
    marginVertical: 8,
  },
  groundContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groundIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groundEmoji: {
    fontSize: 28,
  },
  groundInfo: {
    flex: 1,
  },
  groundTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  groundDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  groundStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
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
  },
});

export default GroundSelectionScreen;