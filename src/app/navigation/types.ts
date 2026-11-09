// src/app/navigation/types.ts
export type RootStackParamList = {
  Login: undefined;
  Patients: undefined;
  PatientDoses: { patientId: number; patientName: string };
  Incident: { doseId: number };
};