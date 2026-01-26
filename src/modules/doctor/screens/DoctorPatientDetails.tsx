import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';

export type Prescription = {
  medicine: string;
  dosage: string;
  duration: string;
};

export type PatientRecord = {
  id: string;
  name: string;
  gender: string;
  age: string;
  lastVisit: string;
  diagnosis: string;
  doctorNotes: string;
  prescriptions: Prescription[];
  avatar: string;
};

type DoctorPatientDetailsProps = {
  theme: ThemePalette;
  patient: PatientRecord;
  onBack: () => void;
};

const DoctorPatientDetails: React.FC<DoctorPatientDetailsProps> = ({ theme, patient, onBack }) => {
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
           <Icon name="arrow-left" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Medical History</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
         {/* Patient Hero Section */}
         <View style={[styles.heroSection, { backgroundColor: theme.card }]}>
            <Image source={{ uri: patient.avatar }} style={styles.avatar} />
            <View style={styles.heroInfo}>
               <Text style={[styles.patientName, { color: theme.textPrimary }]}>{patient.name}</Text>
               <Text style={[styles.patientMeta, { color: theme.textSecondary }]}>
                  {patient.id} • {patient.gender}, {patient.age} Years
               </Text>
               <View style={styles.visitBadge}>
                  <Text style={styles.visitBadgeText}>Last Visit: {patient.lastVisit}</Text>
               </View>
            </View>
         </View>

         {/* Diagnosis Section */}
         <View style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
               <Icon name="clipboard-pulse-outline" size={22} color={theme.hero} />
               <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Diagnosis</Text>
            </View>
            <Text style={[styles.sectionBody, { color: theme.textSecondary }]}>{patient.diagnosis}</Text>
         </View>

         {/* Doctor's Advice */}
         <View style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
               <Icon name="message-draw" size={22} color={theme.accent} />
               <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Doctor's Advice</Text>
            </View>
            <Text style={[styles.sectionBody, { color: theme.textSecondary }]}>{patient.doctorNotes}</Text>
         </View>

         {/* Prescriptions */}
         <View style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
               <Icon name="pill" size={22} color="#10B981" />
               <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Prescriptions</Text>
            </View>
            {patient.prescriptions.map((med, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.medItem, 
                  { borderBottomColor: theme.border, borderBottomWidth: idx === patient.prescriptions.length - 1 ? 0 : 1 }
                ]}
              >
                 <View style={styles.medTop}>
                    <Text style={[styles.medName, { color: theme.textPrimary }]}>{med.medicine}</Text>
                    <View style={styles.durationTag}>
                       <Text style={styles.durationText}>{med.duration}</Text>
                    </View>
                 </View>
                 <Text style={[styles.dosageText, { color: theme.accent }]}>Dosage: {med.dosage}</Text>
              </View>
            ))}
         </View>

         {/* Action Buttons */}
         <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: theme.hero }]}>
               <Icon name="share-variant-outline" size={20} color="#FFF" />
               <Text style={styles.mainActionText}>Share Report</Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  patientName: {
    fontSize: 22,
    fontWeight: '800',
  },
  patientMeta: {
    fontSize: 14,
    fontWeight: '600',
  },
  visitBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  visitBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  section: {
    padding: 20,
    borderRadius: 24,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  medItem: {
    paddingVertical: 12,
  },
  medTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medName: {
    fontSize: 16,
    fontWeight: '700',
  },
  durationTag: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  dosageText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  actionContainer: {
    marginTop: 10,
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 20,
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mainActionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DoctorPatientDetails;
