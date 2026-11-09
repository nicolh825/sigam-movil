// src/features/doses/screens/IncidentScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { apiClient } from '../../../core/http/apiClient';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../app/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type IncidentRouteProp = RouteProp<RootStackParamList, 'Incident'>;

export const IncidentScreen = () => {
  const route = useRoute<IncidentRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { doseId } = route.params;

  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitIncident = async () => {
    setError('');
    if (!descripcion.trim()) {
      setError('Por favor, describe el motivo del incidente.');
      return;
    }

    setLoading(true);
    try {
      // Consumiendo endpoint para registrar incidente de la dosis
      await apiClient.post(`/dosis/${doseId}/incidente`, {
        descripcion: descripcion.trim(),
      });
      
      Alert.alert(
        'Incidente registrado',
        'El reporte se ha guardado correctamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error(err);
      setError('No se pudo registrar el incidente. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reportar Incidente</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Detalle del inconveniente (Dosis ID: {doseId})</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.textArea}
          placeholder="Escriba el motivo por el cual no se pudo administrar la dosis..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmitIncident}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Enviar Reporte</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#2C3E50',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    color: '#3498DB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#2C3E50',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    height: 48,
    backgroundColor: '#C0392B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
    backgroundColor: '#FADBD8',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
  },
});