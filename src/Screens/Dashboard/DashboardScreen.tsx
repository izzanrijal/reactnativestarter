/**
 * @description 
 * Main dashboard screen showing overview of children, consultations, and blog content.
 * 
 * @dependencies
 * - react-native: Core components
 * - @react-navigation/native: Navigation
 * 
 * @notes
 * - Shows child avatars
 * - Displays recent consultations
 * - Shows featured blog content
 */

import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChildAvatars } from '../../Components/Dashboard/ChildAvatars';
import { ConsultationWidget } from '../../Components/Dashboard/ConsultationWidget';
import { BlogContent } from '../../Components/Dashboard/BlogContent';
import { NewConsultationButton } from '../../Components/Dashboard/NewConsultationButton';
import { useDashboard } from '../../Hooks/useDashboard';
import { theme } from '../../Config/theme';

export const DashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { 
    isLoading,
    children,
    consultations,
    blogPosts,
    refreshDashboard,
  } = useDashboard();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20 }
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshDashboard}
          colors={[theme.colors.primary.main]}
          tintColor={theme.colors.primary.main}
        />
      }
    >
      {/* Child Avatars Section */}
      <View style={[styles.section, { width }]}>
        <ChildAvatars children={children} />
      </View>

      {/* Recent Consultations Section */}
      <View style={[styles.section, { width }]}>
        <ConsultationWidget consultations={consultations} />
      </View>

      {/* Blog Content Section */}
      <View style={[styles.section, { width }]}>
        <BlogContent posts={blogPosts} />
      </View>

      {/* New Consultation Button */}
      <NewConsultationButton />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
}); 