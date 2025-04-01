/**
 * @description 
 * Main bottom tab navigator for authenticated users.
 * 
 * Key features:
 * - Bottom tab navigation
 * - Custom tab bar styling
 * - Screen-specific options
 * 
 * @dependencies
 * - @react-navigation/bottom-tabs: Bottom tab navigator
 * - @expo/vector-icons: Icon components
 * - theme: Global theme configuration
 * 
 * @notes
 * - Handles main app navigation flow
 * - Customizable tab bar appearance
 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { DashboardScreen } from '../Screens/Dashboard/DashboardScreen';
import { ChildrenScreen } from '../Screens/Children/ChildrenScreen';
import { DoctorsScreen } from '../Screens/Doctors/DoctorsScreen';
import { HistoryScreen } from '../Screens/History/HistoryScreen';
import { ProfileScreen } from '../Screens/Profile/ProfileScreen';
import { theme } from '../Config/theme';

export type MainTabParamList = {
  Beranda: undefined;
  Anak: undefined;
  Ahli: undefined;
  Riwayat: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral.gray200,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Beranda" 
        component={DashboardScreen}
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Anak" 
        component={ChildrenScreen}
        options={{
          title: 'Anak',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="child" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Ahli" 
        component={DoctorsScreen}
        options={{
          title: 'Ahli',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-md" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Riwayat" 
        component={HistoryScreen}
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 