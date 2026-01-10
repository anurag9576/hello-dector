import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';

type DoctorHomeProps = {
  theme: ThemePalette;
  onLogout: () => void;
};

const DoctorHome: React.FC<DoctorHomeProps> = ({ theme, onLogout }) => {
  const { mode } = useThemeContext();

  const metrics = [
    { label: 'Total Patients', value: '1.2k', icon: 'account-group', color: theme.accent, trend: '+12%' },
    { label: 'Appointments', value: '42', icon: 'calendar-check', color: theme.hero, trend: '+5%' },
    { label: 'Pending Reviews', value: '5', icon: 'file-document-edit', color: theme.warning, trend: '-2' },
    { label: 'Rating', value: '4.9', icon: 'star', color: '#FBBF24', trend: 'High' },
  ];

  const upcomingAppointments = [
    { name: 'Rahul Sharma', time: '10:00 AM', type: 'Video', status: 'In-Call', gender: 'Male, 28' },
    { name: 'Priya Verma', time: '11:30 AM', type: 'In-Clinic', status: 'Waiting', gender: 'Female, 34' },
    { name: 'Amit Singh', time: '02:00 PM', type: 'In-Clinic', status: 'Confirmed', gender: 'Male, 45' },
    { name: 'Sneha Patil', time: '04:15 PM', type: 'Video', status: 'Confirmed', gender: 'Female, 29' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      {/* Enhanced Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
           <Image
              source={require('../../../screens/image/logo.png')} 
              style={styles.avatar}
           />
           <View>
             <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back,</Text>
             <View style={styles.nameRow}>
                <Text style={[styles.doctorName, { color: theme.textPrimary }]}>Dr. Aditi Rao</Text>
                <Icon name="check-decagram" size={16} color={theme.accent} style={{ marginLeft: 4 }} />
             </View>
           </View>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.background }]}>
          <Icon name="bell-outline" size={24} color={theme.textPrimary} />
          <View style={[styles.badge, { backgroundColor: theme.danger }]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Modern Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((item, index) => (
            <View key={index} style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <View style={styles.metricHeader}>
                 <View style={[styles.metricIcon, { backgroundColor: item.color + '15' }]}>
                    <Icon name={item.icon} size={22} color={item.color} />
                 </View>
                 <Text style={[styles.trendText, { color: item.trend.startsWith('-') ? theme.danger : theme.success }]}>
                    {item.trend}
                 </Text>
              </View>
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{item.value}</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.hero }]}>
              <View style={styles.actionIconBox}>
                 <Icon name="calendar-plus" size={24} color="#fff" />
              </View>
              <View>
                 <Text style={styles.actionBtnText}>Add Slot</Text>
                 <Text style={styles.actionBtnSub}>New appointment</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accent }]}>
              <View style={styles.actionIconBox}>
                 <Icon name="account-search" size={24} color="#fff" />
              </View>
              <View>
                 <Text style={styles.actionBtnText}>Search</Text>
                 <Text style={styles.actionBtnSub}>Find patient</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Appointment List */}
        <View style={styles.section}>
           <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Today's Queue</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.hero }]}>View Calendar</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingAppointments.map((appt, i) => (
            <View key={i} style={[styles.apptCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.apptLeft}>
                 <View style={[styles.timeBadge, { backgroundColor: theme.background }]}>
                    <Text style={[styles.timeText, { color: theme.textPrimary }]}>{appt.time}</Text>
                 </View>
                 <View style={styles.verticalLine} />
              </View>
              
              <View style={styles.apptContent}>
                 <View style={styles.apptHeader}>
                    <Text style={[styles.apptName, { color: theme.textPrimary }]}>{appt.name}</Text>
                    {appt.type === 'Video' ? (
                       <Icon name="video" size={18} color="#7C3AED" />
                    ) : (
                       <Icon name="hospital-building" size={18} color="#059669" />
                    )}
                 </View>
                 <Text style={[styles.apptGender, { color: theme.textSecondary }]}>{appt.gender}</Text>
                 
                 <View style={styles.apptFooter}>
                    <View style={[
                       styles.statusBadge, 
                       { backgroundColor: appt.status === 'In-Call' ? '#DCFCE7' : appt.status === 'Waiting' ? '#FEF3C7' : '#F3F4F6' }
                    ]}>
                       <Text style={{ 
                          fontSize: 12, 
                          fontWeight: '600', 
                          color: appt.status === 'In-Call' ? '#166534' : appt.status === 'Waiting' ? '#D97706' : theme.textSecondary 
                       }}>
                          {appt.status}
                       </Text>
                    </View>
                    <TouchableOpacity style={styles.actionIcon}>
                       <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                 </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  greeting: {
    fontSize: 13,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 10,
    borderRadius: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    width: '47%',
    padding: 16,
    borderRadius: 20,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actionIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  actionBtnSub: {
     color: 'rgba(255,255,255,0.8)',
     fontSize: 11,
  },
  apptCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    marginBottom: 4,
  },
  apptLeft: {
    alignItems: 'center',
    gap: 8,
  },
  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 1,
  },
  apptContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apptName: {
    fontSize: 16,
    fontWeight: '700',
  },
  apptGender: {
    fontSize: 13,
    marginTop: 2,
  },
  apptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionIcon: {
    padding: 4,
  },
});

export default DoctorHome;
