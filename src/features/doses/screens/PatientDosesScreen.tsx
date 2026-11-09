// src/features/doses/screens/PatientDosesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { apiClient } from '../../../core/http/apiClient';
import { DoseCard } from '../components/DoseCard';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../app/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PatientDosesRouteProp = RouteProp<RootStackParamList, 'PatientDoses'>;

export const PatientDosesScreen = () => {
  const route = useRoute<PatientDosesRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { patientId, patientName } = route.params;

  const [doses, setDoses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchDoses = async () => {
    setLoading(true);
    setError('');
    try {
      // Consumiendo endpoint de dosis del paciente
      const response = await apiClient.get(`/pacientes/${patientId}/dosis`);
      setDoses(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las dosis del paciente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoses();
  }, [patientId]);

  const handleAdminister = async (doseId: number) => {
    try {
      await apiClient.post(`/dosis/${doseId}/administrar`);
      Alert.alert('Éxito', 'Dosis administrada correctamente.');
      fetchDoses(); // Recargar lista
    } catch (err) {
      Alert.alert('Error', 'No se pudo registrar la administración de la dosis.');
    }
  };

  const handleReportIncident = (doseId: number) => {
    navigation.navigate('Incident', { doseId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>Dosis de {patientName}</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2980B9" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : doses.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No hay dosis programadas para este paciente.</Text>
        </View>
      ) : (
        <FlatList
          data={doses}
          keyExtractor={(item) => item.id_dosis.toString()}
          renderItem={({ item }) => (
            <DoseCard
              dose={item}
              onAdminister={handleAdminister}
              onReportIncident={handleReportIncident}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#2C3E50',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 12 },
  backText: { color: '#3498DB', fontSize: 14, fontWeight: 'bold' },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', flex: 1 },
  listContainer: { padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#E74C3C', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#7F8C8D', fontSize: 14, textAlign: 'center' },
});