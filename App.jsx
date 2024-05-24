/* eslint-disable prettier/prettier */
import React from 'react';
import AppNavigation from './src/navigation';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </AppNavigation>
    </AuthProvider>
  );
}
