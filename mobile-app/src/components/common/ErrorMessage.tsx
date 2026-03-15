import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { COLORS } from '../../constants';
import Button from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
  showRetryButton?: boolean;
  retryButtonText?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  style,
  showRetryButton = true,
  retryButtonText = 'Try Again',
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.errorText, { color: COLORS.error }]}>
        {message}
      </Text>
      {showRetryButton && onRetry && (
        <Button
          title={retryButtonText}
          onPress={onRetry}
          variant="outline"
          size="small"
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 8,
  },
});

export default ErrorMessage;