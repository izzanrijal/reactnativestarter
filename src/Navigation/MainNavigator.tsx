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
 * - theme: Global theme configuration
 * 
 * @notes
 * - Handles main app navigation flow
 * - Customizable tab bar appearance
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
      }}
    >
      <Tab.Screen 
        name="Beranda" 
        component={DashboardScreen}
        options={{
          title: 'Beranda',
          // Add icon configuration later
        }}
      />
      <Tab.Screen 
        name="Anak" 
        component={ChildrenScreen}
        options={{
          title: 'Anak',
          // Add icon configuration later
        }}
      />
      <Tab.Screen 
        name="Ahli" 
        component={DoctorsScreen}
        options={{
          title: 'Ahli',
          // Add icon configuration later
        }}
      />
      <Tab.Screen 
        name="Riwayat" 
        component={HistoryScreen}
        options={{
          title: 'Riwayat',
          // Add icon configuration later
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
          // Add icon configuration later
        }}
      />
    </Tab.Navigator>
  );
}; 