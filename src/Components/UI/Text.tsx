/**
 * @description 
 * Custom Text component that enforces consistent typography.
 * 
 * Key features:
 * - Predefined variants (heading1-6, body, caption)
 * - Color variants
 * - Weight variants
 * - Optional truncation
 * 
 * @dependencies
 * - react-native: Core Text component
 * - theme: Global theme configuration
 * 
 * @notes
 * - Ensures consistent text styling across the app
 * - Handles different font weights
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { theme } from '../../Config/theme';

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'body1' 
  | 'body2' 
  | 'caption';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: keyof typeof theme.colors.text;
  weight?: keyof typeof theme.typography.fontWeight;
  style?: TextStyle;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body1',
  color = 'primary',
  weight = 'normal',
  style,
  numberOfLines,
}) => {
  const getVariantStyles = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize['4xl'],
          lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize['3xl'],
          lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize['2xl'],
          lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight,
        };
      case 'h4':
        return {
          fontSize: theme.typography.fontSize.xl,
          lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.tight,
        };
      case 'h5':
        return {
          fontSize: theme.typography.fontSize.lg,
          lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.tight,
        };
      case 'h6':
        return {
          fontSize: theme.typography.fontSize.base,
          lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.tight,
        };
      case 'body2':
        return {
          fontSize: theme.typography.fontSize.sm,
          lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.xs,
          lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
        };
      case 'body1':
      default:
        return {
          fontSize: theme.typography.fontSize.base,
          lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
        };
    }
  };

  const textStyles = [
    styles.text,
    getVariantStyles(),
    {
      color: theme.colors.text[color],
      fontWeight: theme.typography.fontWeight[weight],
    } as TextStyle,
    style,
  ];

  return (
    <RNText style={textStyles} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.typography.fontFamily.primary,
  },
}); 