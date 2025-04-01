/**
 * @description 
 * Component for displaying child avatars on the dashboard.
 * 
 * @dependencies
 * - react-native: Core components
 * - @expo/vector-icons: Icons
 * - @react-navigation/native: Navigation
 * 
 * @notes
 * - Shows child avatars in a horizontal scroll
 * - Includes add child button
 */

import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Child } from '../../Hooks/useDashboard';
import { theme } from '../../Config/theme';

interface ChildAvatarsProps {
  children: Child[];
}

export const ChildAvatars: React.FC<ChildAvatarsProps> = ({ children }) => {
  const navigation = useNavigation();

  const handleAddChild = () => {
    navigation.navigate('Anak', { screen: 'AddChild' });
  };

  const handlePressChild = (childId: string) => {
    navigation.navigate('Anak', { screen: 'ChildDetails', params: { childId } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Anak Anda</Text>
        <TouchableOpacity onPress={handleAddChild}>
          <Text style={styles.addText}>+ Tambah Anak</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children.map((child) => (
          <TouchableOpacity
            key={child.id}
            style={styles.avatarContainer}
            onPress={() => handlePressChild(child.id)}
          >
            {child.photo_url ? (
              <Image 
                source={{ uri: child.photo_url }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <FontAwesome5 
                  name="child" 
                  size={24} 
                  color={theme.colors.neutral.gray400} 
                />
              </View>
            )}
            <Text style={styles.childName} numberOfLines={1}>
              {child.name}
            </Text>
          </TouchableOpacity>
        ))}

        {children.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Belum ada anak yang terdaftar
            </Text>
          </View>
        )}
      </ScrollView>
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
  addText: {
    fontSize: 14,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  placeholderAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  childName: {
    fontSize: 14,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
}); 