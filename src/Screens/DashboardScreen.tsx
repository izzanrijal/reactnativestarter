/**
 * @description 
 * Main dashboard screen component that displays child avatars, recent consultations,
 * and blog posts.
 * 
 * @dependencies
 * - react-native: Core components
 * - @react-navigation/native: Navigation
 * 
 * @notes
 * - Uses useDashboard hook for data management
 * - Implements pull-to-refresh functionality
 * - Shows loading states for each section
 */

import React from 'react';
import { 
  View, 
  ScrollView, 
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useDashboard } from '../Hooks/useDashboard';
import { ChildAvatars } from '../Components/Dashboard/ChildAvatars';
import { ConsultationWidget } from '../Components/Dashboard/ConsultationWidget';
import { BlogPostWidget } from '../Components/Dashboard/BlogPostWidget';
import { theme } from '../Config/theme';

export const DashboardScreen: React.FC = () => {
  const { 
    children,
    consultations,
    blogPosts,
    isLoading,
    refreshDashboard,
  } = useDashboard();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshDashboard}
          colors={[theme.colors.primary.main]}
          tintColor={theme.colors.primary.main}
        />
      }
    >
      <ChildAvatars children={children} />
      <ConsultationWidget consultations={consultations} />
      <BlogPostWidget blogPosts={blogPosts} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    paddingHorizontal: 16,
  },
}); 