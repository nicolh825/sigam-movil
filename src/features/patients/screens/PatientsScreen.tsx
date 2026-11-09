// src/features/patients/screens/PatientsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { apiClient } from '../../../core/http/apiClient';
import { useAuth } from '../../../app/providers/AuthProvider';

interface Patient {
  id_paciente: number;
  tipo_documento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  dosis_pendientes: number;
}

export const PatientsScreen = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { user, logout } = useAuth();

  const fetchPatients = async (query: string = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/pacientes?asignados=true&buscar=${query}`);
      setPatients(response.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los pacientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.length === 0 || text.length >= 3) {
      fetchPatients(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Enfermero(a):</Text>
          <Text style={styles.userName}>{user?.nombres || 'Personal de Salud'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o documento..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2980B9" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : patients.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No se encontraron pacientes asignados.</Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id_paciente.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.patientName}>
                  {item.nombres} {item.apellidos}
                </Text>
                <Text style={styles.patientDoc}>
                  {item.tipo_documento}: {item.documento}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.dosis_pendientes} pendientes</Text>
              </View>
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: { color: '#BDC3C7', fontSize: 12 },
  userName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#E74C3C', borderRadius: 6 },
  logoutText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  searchContainer: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  searchInput: { height: 48, borderWidth: 1, borderColor: '#BDC3C7', borderRadius: 8, paddingHorizontal: 16, fontSize: 14, backgroundColor: '#FAFAFA', color: '#2C3E50' },
  listContainer: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4 },
  patientDoc: { fontSize: 14, color: '#7F8C8D' },
  badge: { backgroundColor: '#EBF5FB', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: '#AED6F1' },
  badgeText: { color: '#2980B9', fontSize: 12, fontWeight: 'bold' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#E74C3C', fontSize: 14, textAlign: 'center' },
  emptyText: { color: '#7F8C8D', fontSize: 14, textAlign: 'center' },
});