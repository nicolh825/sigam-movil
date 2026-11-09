// src/app/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import { PatientsScreen } from '../../features/patients/screens/PatientsScreen';
import { PatientDosesScreen } from '../../features/doses/screens/PatientDosesScreen';
import { IncidentScreen } from '../../features/doses/screens/IncidentScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2980B9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Patients" component={PatientsScreen} />
            <Stack.Screen name="PatientDoses" component={PatientDosesScreen} />
            <Stack.Screen name="Incident" component={IncidentScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});