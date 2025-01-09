import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import { AuthProvider } from './AuthProvider';

export default function App() {
  return(
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
    </AuthProvider>
  );
}
