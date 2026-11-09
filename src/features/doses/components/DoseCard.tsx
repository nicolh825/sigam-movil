// src/features/doses/components/DoseCard.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface Dose {
  id_dosis: number;
  medicamento: string;
  dosis: string;
  via_administracion: string;
  hora_programada: string;
  estado: 'Pendiente' | 'Administrada' | 'Omitida';
}

interface DoseCardProps {
  dose: Dose;
  onAdminister: (id: number) => void;
  onReportIncident: (id: number) => void;
}

export const DoseCard: React.FC<DoseCardProps> = ({ dose, onAdminister, onReportIncident }) => {
  const isPending = dose.estado === 'Pendiente';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.medName}>{dose.medicamento}</Text>
        <View style={[styles.badge, isPending ? styles.badgePending : styles.badgeDone]}>
          <Text style={[styles.badgeText, isPending ? styles.textPending : styles.textDone]}>
            {dose.estado}
          </Text>
        </View>
      </View>

      <Text style={styles.detail}>Dosis: {dose.dosis}</Text>
      <Text style={styles.detail}>Vía: {dose.via_administracion}</Text>
      <Text style={styles.detail}>Hora programada: {dose.hora_programada}</Text>

      {isPending && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.btnAdminister}
            onPress={() => onAdminister(dose.id_dosis)}
          >
            <Text style={styles.btnText}>Administrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnIncident}
            onPress={() => onReportIncident(dose.id_dosis)}
          >
            <Text style={styles.btnIncidentText}>Incidente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: '#FCF3CF',
  },
  badgeDone: {
    backgroundColor: '#D4EFDF',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textPending: {
    color: '#B7950B',
  },
  textDone: {
    color: '#1E8449',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F4',
    paddingTop: 12,
  },
  btnAdminister: {
    flex: 1,
    backgroundColor: '#27AE60',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 6,
  },
  btnIncident: {
    flex: 1,
    backgroundColor: '#FADBD8',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnIncidentText: {
    color: '#C0392B',
    fontWeight: 'bold',
    fontSize: 14,
  },
});