import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Card, Button } from '../../components/common';
import { COLORS } from '../../constants';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            // Navigation will automatically go to auth screen due to the auth check in AppNavigator
          },
        },
      ]
    );
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help functionality coming soon!');
  };

  const handleAbout = () => {
    Alert.alert(
      'About IOAI Training Grounds',
      'An interactive mobile learning platform for AI and machine learning education.\n\nVersion 1.0.0',
      [{ text: 'OK' }]
    );
  };

  const menuItems = [
    {
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      icon: '⚙️',
      onPress: handleSettings,
    },
    {
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: '❓',
      onPress: handleHelp,
    },
    {
      title: 'About',
      subtitle: 'App information and version',
      icon: 'ℹ️',
      onPress: handleAbout,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
          {user?.name || 'Student'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
          {user?.email || 'student@example.com'}
        </Text>
      </View>

      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Account Status
        </Text>

        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Member since
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Account type
            </Text>
            <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
              {user?.role || 'Student'}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Status
            </Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              Active
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.menuSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Menu
        </Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Card style={styles.menuCard}>
              <View style={styles.menuContent}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuText}>
                  <Text style={[styles.menuTitle, { color: theme.colors.onSurface }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  statsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsCard: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSection: {
    paddingHorizontal: 24,
  },
  menuItem: {
    marginBottom: 8,
  },
  menuCard: {
    padding: 16,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 30,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  logoutSection: {
    padding: 24,
    marginTop: 24,
  },
  logoutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;