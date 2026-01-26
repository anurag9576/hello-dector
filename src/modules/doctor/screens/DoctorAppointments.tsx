import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';

type Appointment = {
  id: string;
  patientName: string;
  type: 'In-Person' | 'Video' | 'Emergency';
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  avatar: string;
  symptoms: string;
};

type DoctorAppointmentsProps = {
  theme: ThemePalette;
  onBack?: () => void;
};

const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({ theme, onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState<'Upcoming' | 'Past' | 'Today'>('Today');

  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Rahul Sharma',
      type: 'Video',
      time: '10:30 AM',
      status: 'Confirmed',
      avatar: 'https://i.pravatar.cc/150?u=1',
      symptoms: 'Chest pain, short breath',
    },
    {
      id: '2',
      patientName: 'Priya Patel',
      type: 'In-Person',
      time: '11:15 AM',
      status: 'Pending',
      avatar: 'https://i.pravatar.cc/150?u=2',
      symptoms: 'Routine checkup',
    },
    {
      id: '3',
      patientName: 'Amit Kumar',
      type: 'Emergency',
      time: '12:00 PM',
      status: 'Confirmed',
      avatar: 'https://i.pravatar.cc/150?u=3',
      symptoms: 'High blood pressure',
    },
  ];

  const renderStats = () => (
    <View style={styles.statsContainer}>
       <View style={[styles.statCard, { backgroundColor: '#4F46E5' }]}>
          <Text style={styles.statVal}>12</Text>
          <Text style={styles.statTitle}>Total Visits</Text>
       </View>
       <View style={[styles.statCard, { backgroundColor: '#10B981' }]}>
          <Text style={styles.statVal}>8</Text>
          <Text style={styles.statTitle}>Completed</Text>
       </View>
       <View style={[styles.statCard, { backgroundColor: '#F59E0B' }]}>
          <Text style={styles.statVal}>4</Text>
          <Text style={styles.statTitle}>Remaining</Text>
       </View>
    </View>
  );

  const renderItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={[styles.appointmentCard, { backgroundColor: theme.card }]}>
      <View style={styles.cardHeader}>
         <View style={styles.clientInfo}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={[styles.patientName, { color: theme.textPrimary }]}>{item.patientName}</Text>
              <Text style={[styles.symptoms, { color: theme.textSecondary }]}>{item.symptoms}</Text>
            </View>
         </View>
         <View style={[styles.badge, { backgroundColor: item.type === 'Emergency' ? '#FEE2E2' : '#E0E7FF' }]}>
            <Text style={[styles.badgeText, { color: item.type === 'Emergency' ? '#EF4444' : '#4338CA' }]}>{item.type}</Text>
         </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.cardFooter}>
         <View style={styles.footerInfo}>
            <Icon name="clock-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>{item.time}</Text>
         </View>
         <View style={styles.footerActions}>
            <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.accent }]}>
               <Text style={[styles.actionText, { color: theme.accent }]}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: theme.accent }]}>
               <Text style={styles.mainActionText}>{item.type === 'Video' ? 'Start Call' : 'Check-in'}</Text>
            </TouchableOpacity>
         </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
            <Icon name="arrow-left" size={26} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.textPrimary }]}>My Visits</Text>
        </View>
        <TouchableOpacity style={[styles.calendarBtn, { backgroundColor: theme.card }]}>
           <Icon name="calendar-month" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
         {renderStats()}

         {/* Filters */}
         <View style={styles.filterRow}>
            {['Today', 'Upcoming', 'Past'].map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setSelectedFilter(f as any)}
                style={[
                  styles.filterTab,
                  selectedFilter === f && { backgroundColor: theme.accent }
                ]}
              >
                <Text style={[
                  styles.filterText,
                  { color: selectedFilter === f ? '#FFF' : theme.textSecondary }
                ]}>{f}</Text>
              </TouchableOpacity>
            ))}
         </View>

         {/* List */}
         <View style={styles.listContainer}>
            {appointments.map(item => (
              <React.Fragment key={item.id}>
                {renderItem({ item })}
              </React.Fragment>
            ))}
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
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  calendarBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  statVal: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  statTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  appointmentCard: {
    borderRadius: 24,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
  },
  symptoms: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mainActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  mainActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default DoctorAppointments;
