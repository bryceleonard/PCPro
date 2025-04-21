import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TeamsScreen } from '../screens/TeamsScreen';
import { GamesScreen } from '../screens/GamesScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { TeamDetailsScreen } from '../screens/TeamDetailsScreen';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

type RootTabParamList = {
  Home: undefined;
  Teams: undefined;
  Games: undefined;
  Analysis: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TeamsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Teams" component={TeamsScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
    </Stack.Navigator>
  );
};

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Teams') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'basketball' : 'basketball-outline';
          } else {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a6da7',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Teams" component={TeamsStack} />
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
    </Tab.Navigator>
  );
}; 