import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { PatientRecord } from './DoctorPatientDetails';

type DoctorPatientsProps = {
  theme: ThemePalette;
  onSelectPatient: (patient: PatientRecord) => void;
  onBack?: () => void;
};

const DoctorPatients: React.FC<DoctorPatientsProps> = ({ theme, onSelectPatient, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const patients: PatientRecord[] = [
    {
      id: 'P001',
      name: 'Aditya Verma',
      gender: 'Male',
      age: '32',
      lastVisit: '24 Jan 2026',
      diagnosis: 'Seasonal Flu & Fever',
      doctorNotes: 'Patient was suffering from high fever and body ache. Advised complete bed rest for 3 days and plenty of fluids. Avoid cold drinks.',
      prescriptions: [
        { medicine: 'Paracetamol 650mg', dosage: '1-0-1 (After Food)', duration: '3 Days' },
        { medicine: 'Amoxicillin 500mg', dosage: '1-1-1 (After Food)', duration: '5 Days' },
        { medicine: 'Vitamin C', dosage: '0-1-0', duration: '10 Days' },
      ],
      avatar: 'https://i.pravatar.cc/150?u=a1',
    },
    {
      id: 'P002',
      name: 'Meera Kapoor',
      gender: 'Female',
      age: '27',
      lastVisit: '22 Jan 2026',
      diagnosis: 'Migraine',
      doctorNotes: 'Severe headache on the left side. Likely triggered by sleep deprivation. Advised maintaining a sleep schedule and dark room rest during attacks.',
      prescriptions: [
        { medicine: 'Naproxen 500mg', dosage: 'Only when needed', duration: 'N/A' },
        { medicine: 'Magnesium Supplement', dosage: '0-0-1 (Before Bed)', duration: '1 Month' },
      ],
      avatar: 'https://i.pravatar.cc/150?u=a2',
    },
    {
      id: 'P003',
      name: 'Suresh Raina',
      gender: 'Male',
      age: '45',
      lastVisit: '20 Jan 2026',
      diagnosis: 'Hypertension',
      doctorNotes: 'Blood pressure was 150/95. Needs regular monitoring. Advised low salt diet and 30 mins morning walk.',
      prescriptions: [
        { medicine: 'Telmisartan 40mg', dosage: '1-0-0 (Empty Stomach)', duration: 'Long-term' },
      ],
      avatar: 'https://i.pravatar.cc/150?u=a3',
    },
  ];

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPatientCard = (patient: PatientRecord) => (
    <TouchableOpacity 
      key={patient.id}
      style={[styles.patientCard, { backgroundColor: theme.card }]}
      onPress={() => onSelectPatient(patient)}
    >
      <View style={styles.cardTop}>
         {patient.avatar ? (
           <Image source={{ uri: patient.avatar }} style={styles.patientAvatar} />
         ) : (
           <View style={[styles.patientAvatar, { backgroundColor: theme.accent + '15', justifyContent: 'center', alignItems: 'center' }]}>
             <Icon name="account" size={30} color={theme.accent} />
           </View>
         )}
         <View style={styles.basicInfo}>
            <Text style={[styles.patientName, { color: theme.textPrimary }]}>{patient.name}</Text>
            <Text style={[styles.patientMeta, { color: theme.textSecondary }]}>
               {patient.id} • {patient.gender}, {patient.age} yrs
            </Text>
         </View>
         <Icon name="chevron-right" size={24} color={theme.textSecondary} />
      </View>
      <View style={[styles.diagnosisBadge, { backgroundColor: theme.hero + '15' }]}>
         <Icon name="clipboard-text-outline" size={14} color={theme.hero} />
         <Text style={[styles.diagnosisText, { color: theme.hero }]}>Last: {patient.diagnosis}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Icon name="arrow-left" size={26} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Patient Records</Text>
        </View>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>History of treated patients</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
         <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Icon name="magnify" size={24} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Search by name or ID..."
              placeholderTextColor={theme.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
         </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         {filteredPatients.map(renderPatientCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 1,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  patientCard: {
    padding: 16,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  basicInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
  },
  patientMeta: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  diagnosisBadge: {
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diagnosisText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default DoctorPatients;
