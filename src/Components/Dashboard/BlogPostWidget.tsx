/**
 * @description 
 * Widget component for displaying recent blog posts on the dashboard.
 * 
 * @dependencies
 * - react-native: Core components
 * - @expo/vector-icons: Icons
 * - @react-navigation/native: Navigation
 * 
 * @notes
 * - Shows recent blog post cards
 * - Links to blog post details
 */

import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlogPost } from '../../Hooks/useDashboard';
import { theme } from '../../Config/theme';
import { formatRelativeTime } from '../../utils/date';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BlogNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BlogPostWidgetProps {
  blogPosts: BlogPost[];
}

export const BlogPostWidget: React.FC<BlogPostWidgetProps> = ({ 
  blogPosts 
}) => {
  const navigation = useNavigation<BlogNavigationProp>();

  const handleViewAll = () => {
    navigation.navigate('Blog');
  };

  const handlePressBlogPost = (postId: string) => {
    navigation.navigate('BlogPost', { postId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Artikel Terbaru</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {blogPosts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.blogCard}
          onPress={() => handlePressBlogPost(post.id)}
        >
          {post.thumbnail_url ? (
            <Image 
              source={{ uri: post.thumbnail_url }} 
              style={styles.thumbnail}
            />
          ) : (
            <View style={styles.placeholderThumbnail}>
              <FontAwesome5 
                name="newspaper" 
                size={24} 
                color={theme.colors.neutral.gray400} 
              />
            </View>
          )}
          
          <View style={styles.contentContainer}>
            <Text style={styles.category}>
              {post.category}
            </Text>
            <Text style={styles.title} numberOfLines={2}>
              {post.title}
            </Text>
            <Text style={styles.excerpt} numberOfLines={2}>
              {post.excerpt}
            </Text>
            <View style={styles.metaContainer}>
              <Text style={styles.timeText}>
                {formatRelativeTime(new Date(post.published_at))}
              </Text>
              <Text style={styles.readTime}>
                • {post.read_time} menit baca
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {blogPosts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Belum ada artikel
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  blogCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  placeholderThumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: theme.colors.primary.main,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  excerpt: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 8,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  readTime: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
}); 