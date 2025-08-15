// import React from 'react';
// import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './src/screens/HomeScreen';
// import DetailsScreen from './src/screens/DetailsScreen';

// const Stack = createNativeStackNavigator();

// const darkTheme: Theme = {
//   ...DefaultTheme,
//   colors: { ...DefaultTheme.colors, background: '#0D0D0D', card: '#0D0D0D', text: '#FFFFFF' }
// };

// export default function App() {
//   return (
//     <NavigationContainer theme={darkTheme}>
//       <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Details" component={DetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen'; // your details screen
import {colors} from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'Movies') iconName = focused ? 'film' : 'film-outline';
          if (route.name === 'Tickets') iconName = focused ? 'ticket' : 'ticket-outline';
          if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Movies" component={DummyScreen} />
      <Tab.Screen name="Tickets" component={DummyScreen} />
      <Tab.Screen name="Profile" component={DummyScreen} />
    </Tab.Navigator>
  );
}

function DummyScreen() {
  return null;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

