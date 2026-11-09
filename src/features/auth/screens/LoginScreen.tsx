// src/features/auth/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { apiClient } from '../../../core/http/apiClient';
import { useAuth } from '../../../app/providers/AuthProvider';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();

  const handleLogin = async () => {
    setErrorMessage('');
    if (!correo || !password) {
      setErrorMessage('Por favor ingrese correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      // Consumiendo API-01: POST /auth/login
      const response = await apiClient.post('/auth/login', { correo, password });
      
      // Imprimimos la respuesta para depurar en la terminal de Metro
      console.log("Respuesta completa del servidor:", response.data);

      const token = response.data?.token;
      const usuario = response.data?.usuario || response.data?.user;

      if (!token || !usuario) {
        setErrorMessage('La respuesta del servidor está incompleta.');
        setLoading(false);
        return;
      }

      // Validar que sea rol enfermero según reglas de negocio
      if (usuario.rol !== 'Enfermero') {
        setErrorMessage('Acceso denegado. Se requiere rol de Enfermero.');
        setLoading(false);
        return;
      }

      await login(token, usuario);
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        const status = error.response.status;
        if (status === 401) setErrorMessage('Credenciales incorrectas.');
        else if (status === 403) setErrorMessage('La cuenta está inactiva.');
        else setErrorMessage('Error en el servidor. Intente nuevamente.');
      } else {
        setErrorMessage('No se pudo conectar al servidor. Verifique su red.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>S.I.G.A.M.</Text>
        <Text style={styles.subtitle}>Sistema Integral de Gestión Médica</Text>
        <Text style={styles.roleLabel}>Móvil - Módulo Enfermería</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 12,
    color: '#3498DB',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    marginBottom: 16,
    color: '#2C3E50',
  },
  button: {
    height: 48,
    backgroundColor: '#2980B9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#95A5A6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#FADBD8',
    padding: 8,
    borderRadius: 6,
  },
});