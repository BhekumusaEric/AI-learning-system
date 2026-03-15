import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';
import { COLORS } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number;
  onPress?: () => void;
  padding?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 2,
  onPress,
  padding = 16,
}) => {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    ...style,
  };

  const contentStyle: ViewStyle = {
    padding,
  };

  if (onPress) {
    return (
      <PaperCard style={cardStyle} elevation={elevation} onPress={onPress}>
        <PaperCard.Content style={contentStyle}>
          {children}
        </PaperCard.Content>
      </PaperCard>
    );
  }

  return (
    <PaperCard style={cardStyle} elevation={elevation}>
      <PaperCard.Content style={contentStyle}>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

export default Card;