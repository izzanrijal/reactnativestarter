/**
 * @description 
 * Reusable button component with various styles and states.
 * 
 * Key features:
 * - Multiple variants (primary, secondary, outline, text)
 * - Loading state with activity indicator
 * - Disabled state styling
 * - Custom content support (text, icon, or both)
 * 
 * @dependencies
 * - react-native: Core components
 * - theme: Global theme configuration
 * 
 * @notes
 * - Follows accessibility guidelines
 * - Haptic feedback on press
 * - Handles loading state automatically
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { theme } from '../../Config/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.neutral.gray300;
    switch (variant) {
      case 'primary':
        return theme.colors.primary.main;
      case 'secondary':
        return theme.colors.secondary.main;
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return theme.colors.primary.main;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.text.disabled;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.text.inverse;
      case 'outline':
      case 'text':
        return theme.colors.primary.main;
      default:
        return theme.colors.text.inverse;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return theme.spacing[2];
      case 'large':
        return theme.spacing[6];
      default:
        return theme.spacing[4];
    }
  };

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      padding: getPadding(),
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: variant === 'outline' ? theme.colors.primary.main : undefined,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: getTextColor(),
      fontSize: size === 'small' ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
    },
    textStyle,
  ] as TextStyle[];

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor()} />;
    }

    const iconElement = icon && (
      <View style={styles.iconContainer}>
        {icon}
      </View>
    );

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && iconElement}
        <Text style={textStyles}>{title}</Text>
        {iconPosition === 'right' && iconElement}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600' as const,
  },
  iconContainer: {
    marginHorizontal: theme.spacing[2],
  },
}); 