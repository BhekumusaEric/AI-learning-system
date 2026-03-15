import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { COLORS } from '../../constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
  text?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
  style,
  fullScreen = false,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = fullScreen
    ? {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }
    : {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator
        size={size}
        color={color || COLORS.primary}
      />
      {text && (
        <Text style={{
          marginTop: 12,
          color: theme.colors.onSurface,
          fontSize: 16,
          textAlign: 'center',
        }}>
          {text}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner;