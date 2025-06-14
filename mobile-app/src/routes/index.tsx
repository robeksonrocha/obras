import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { Home } from '../screens/Home';
import { Login } from '../screens/Login';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
          animationTypeForReplace: 'pop'
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={Login}
        />
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{ 
            headerShown: true,
            title: 'Início',
            headerBackVisible: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 