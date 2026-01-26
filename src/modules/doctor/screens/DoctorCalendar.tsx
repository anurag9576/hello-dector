import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';

type Slot = {
  time: string;
  status: 'Available' | 'Booked' | 'Break' | 'Ongoing';
  patient?: string;
};

type Patient = {
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  weight: string;
  height: string;
  issue: string;
  contact: string;
  email: string;
  avatar: string;
};

type DoctorCalendarProps = {
  theme: ThemePalette;
  onBack: () => void;
};

const DoctorCalendar: React.FC<DoctorCalendarProps> = ({ theme, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showModal, setShowModal] = useState(false);

  const mockPatient: Patient = {
    name: 'Rahul Sharma',
    age: '28',
    gender: 'Male',
    bloodGroup: 'B+',
    weight: '72 kg',
    height: '175 cm',
    issue: 'Chest pain, shortness of breath since morning. History of mild hypertension.',
    contact: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    avatar: 'https://i.pravatar.cc/150?u=1',
  };
  
  const days = [
    { day: 'Mon', date: 26 },
    { day: 'Tue', date: 27 },
    { day: 'Wed', date: 28 },
    { day: 'Thu', date: 29 },
    { day: 'Fri', date: 30 },
    { day: 'Sat', date: 31 },
    { day: 'Sun', date: 1 },
  ];

  const slots: Slot[] = [
    { time: '09:00 AM', status: 'Booked', patient: 'Rahul Sharma' },
    { time: '09:30 AM', status: 'Booked', patient: 'Sneha Patil' },
    { time: '10:00 AM', status: 'Ongoing', patient: 'Amit Singh' },
    { time: '10:30 AM', status: 'Available' },
    { time: '11:00 AM', status: 'Break' },
    { time: '11:30 AM', status: 'Available' },
    { time: '12:00 PM', status: 'Booked', patient: 'Priya Verma' },
    { time: '12:30 PM', status: 'Available' },
    { time: '01:00 PM', status: 'Available' },
    { time: '01:30 PM', status: 'Available' },
  ];

  const getStatusColor = (status: Slot['status']) => {
    switch (status) {
      case 'Available': return '#10B981';
      case 'Booked': return '#6366F1';
      case 'Ongoing': return '#EF4444';
      case 'Break': return '#94A3B8';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
           <Icon name="arrow-left" size={26} color={theme.textPrimary} />
        </TouchableOpacity>
        <View>
           <Text style={[styles.title, { color: theme.textPrimary }]}>Schedule</Text>
           <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Jan 2026</Text>
        </View>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.card }]}>
           <Icon name="plus" size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
         {/* Calendar Strip */}
         <View style={styles.calendarStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
               {days.map((item, index) => (
                 <TouchableOpacity 
                   key={index} 
                   onPress={() => setSelectedDate(item.date)}
                   style={[
                     styles.dayCard, 
                     { backgroundColor: theme.card },
                     selectedDate === item.date && { backgroundColor: theme.accent }
                   ]}
                 >
                    <Text style={[
                      styles.dayText, 
                      { color: theme.textSecondary },
                      selectedDate === item.date && { color: '#FFF' }
                    ]}>{item.day}</Text>
                    <Text style={[
                      styles.dateText, 
                      { color: theme.textPrimary },
                      selectedDate === item.date && { color: '#FFF' }
                    ]}>{item.date}</Text>
                    {selectedDate === item.date && <View style={styles.activeDot} />}
                 </TouchableOpacity>
               ))}
            </ScrollView>
         </View>

         {/* Today Summary */}
         <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
               <View style={styles.summaryItem}>
                  <Text style={[styles.summaryVal, { color: theme.textPrimary }]}>24</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Total Slots</Text>
               </View>
               <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
               <View style={styles.summaryItem}>
                  <Text style={[styles.summaryVal, { color: theme.textPrimary }]}>08</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Booked</Text>
               </View>
               <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
               <View style={styles.summaryItem}>
                  <Text style={[styles.summaryVal, { color: theme.textPrimary }]}>16</Text>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Available</Text>
               </View>
            </View>
         </View>

         {/* Time Slots */}
         <View style={styles.slotsHeader}>
            <Text style={[styles.slotsTitle, { color: theme.textPrimary }]}>Time Slots</Text>
            <View style={styles.legend}>
               <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
               <Text style={[styles.legendText, { color: theme.textSecondary }]}>Available</Text>
            </View>
         </View>

         <View style={styles.slotsContainer}>
            {slots.map((slot, index) => (
              <View key={index} style={styles.slotRow}>
                 <Text style={[styles.slotTime, { color: theme.textSecondary }]}>{slot.time}</Text>
                 <View style={styles.slotMain}>
                    <TouchableOpacity 
                      style={[
                        styles.slotCard, 
                        { backgroundColor: theme.card, borderLeftColor: getStatusColor(slot.status) }
                      ]}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (slot.patient) {
                          setSelectedPatient(mockPatient); // Using mock data for demo
                          setShowModal(true);
                        }
                      }}
                    >
                       <View style={styles.slotContent}>
                          <View>
                             <Text style={[styles.slotStatus, { color: getStatusColor(slot.status) }]}>
                                {slot.status}
                             </Text>
                             {slot.patient && <Text style={[styles.patientName, { color: theme.textPrimary }]}>{slot.patient}</Text>}
                          </View>
                          {slot.status === 'Booked' && (
                             <TouchableOpacity style={styles.detailsBtn}>
                                <Icon name="dots-vertical" size={20} color={theme.textSecondary} />
                             </TouchableOpacity>
                          )}
                       </View>
                    </TouchableOpacity>
                 </View>
              </View>
            ))}
         </View>
      </ScrollView>

       {/* Patient Details Modal */}
       <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
       >
          <View style={styles.modalOverlay}>
             <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                {/* Modal Pull Bar */}
                <View style={[styles.pullBar, { backgroundColor: theme.border }]} />
                
                <View style={styles.modalHeader}>
                   <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Patient Summary</Text>
                   <TouchableOpacity onPress={() => setShowModal(false)}>
                      <Icon name="close" size={24} color={theme.textPrimary} />
                   </TouchableOpacity>
                </View>

                {selectedPatient && (
                   <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                      {/* Patient Top Profile */}
                      <View style={styles.profileSection}>
                         <Image source={{ uri: selectedPatient.avatar }} style={styles.modalAvatar} />
                         <View style={styles.profileInfo}>
                            <Text style={[styles.modalPatientName, { color: theme.textPrimary }]}>{selectedPatient.name}</Text>
                            <Text style={[styles.modalPatientSub, { color: theme.textSecondary }]}>
                               {selectedPatient.gender}, {selectedPatient.age} Years • {selectedPatient.bloodGroup}
                            </Text>
                            <View style={styles.contactRow}>
                               <Icon name="phone" size={14} color={theme.accent} />
                               <Text style={[styles.contactText, { color: theme.textSecondary }]}>{selectedPatient.contact}</Text>
                            </View>
                         </View>
                      </View>

                      {/* Vitals Grid */}
                      <View style={styles.vitalsGrid}>
                         <View style={[styles.vitalCard, { backgroundColor: theme.card }]}>
                            <Icon name="human-male-height" size={20} color="#6366F1" />
                            <Text style={[styles.vitalVal, { color: theme.textPrimary }]}>{selectedPatient.height}</Text>
                            <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>Height</Text>
                         </View>
                         <View style={[styles.vitalCard, { backgroundColor: theme.card }]}>
                            <Icon name="weight-kilogram" size={20} color="#10B981" />
                            <Text style={[styles.vitalVal, { color: theme.textPrimary }]}>{selectedPatient.weight}</Text>
                            <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>Weight</Text>
                         </View>
                         <View style={[styles.vitalCard, { backgroundColor: theme.card }]}>
                            <Icon name="water" size={20} color="#EF4444" />
                            <Text style={[styles.vitalVal, { color: theme.textPrimary }]}>{selectedPatient.bloodGroup}</Text>
                            <Text style={[styles.vitalLabel, { color: theme.textSecondary }]}>Blood</Text>
                         </View>
                      </View>

                      {/* Chief Complaint / Issue */}
                      <View style={[styles.detailSection, { backgroundColor: theme.card }]}>
                         <View style={styles.detailTitleRow}>
                            <Icon name="clipboard-pulse-outline" size={18} color={theme.accent} />
                            <Text style={[styles.detailTitle, { color: theme.textPrimary }]}>Primary Complaint</Text>
                         </View>
                         <Text style={[styles.detailBody, { color: theme.textSecondary }]}>
                            {selectedPatient.issue}
                         </Text>
                      </View>

                      {/* Quick Actions */}
                      <View style={styles.modalActionRow}>
                         <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: theme.hero }]}>
                            <Icon name="message-text-outline" size={20} color="#FFF" />
                            <Text style={styles.modalActionText}>Chat</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={[styles.modalActionBtn, { backgroundColor: theme.accent }]}>
                            <Icon name="video-outline" size={22} color="#FFF" />
                            <Text style={styles.modalActionText}>Start Call</Text>
                         </TouchableOpacity>
                      </View>
                   </ScrollView>
                )}
             </View>
          </View>
       </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarStrip: {
    marginBottom: 24,
  },
  daysScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayCard: {
    width: 60,
    height: 85,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  dayText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFF',
    marginTop: 2,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  summaryCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: '60%',
    opacity: 0.3,
  },
  slotsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  slotsTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  slotsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  slotRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  slotTime: {
    width: 70,
    fontSize: 13,
    fontWeight: '700',
    paddingTop: 14,
  },
  slotMain: {
    flex: 1,
  },
  slotCard: {
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  slotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotStatus: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  detailsBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '75%',
    padding: 24,
    paddingTop: 12,
  },
  pullBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    opacity: 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalScroll: {
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  modalPatientName: {
    fontSize: 22,
    fontWeight: '800',
  },
  modalPatientSub: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '500',
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  vitalCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  vitalVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  vitalLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailSection: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    gap: 12,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 18,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalActionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DoctorCalendar;
