import React, { useEffect, useMemo, useState, useRef } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';
import { doctors, Doctor } from '../../../data/doctors';
import { quickActions } from '../data';
import QuickActions from '../components/QuickActions';
import DoctorCard from '../components/DoctorCard';
import BookingForm, { BookingFormData } from '../components/BookingForm';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { useLiveWeather } from '../hooks/useLiveWeather';

Icon.loadFont();

type PatientHomeProps = {
  theme: ThemePalette;
  onSeeAllDoctors?: () => void;
  onSeeAllSpecialties?: () => void;
  onSeeAllAppointments?: () => void;
  onOpenChat?: () => void;
};

const PatientHome: React.FC<PatientHomeProps> = ({ theme, onSeeAllDoctors, onSeeAllSpecialties, onSeeAllAppointments, onOpenChat }) => {
  const { mode } = useThemeContext();
  const { patientMeta } = usePatientProfile();
  const weather = useLiveWeather(patientMeta.city || 'Pune');
  const topDoctorsRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [topDocsY, setTopDocsY] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const greetingDescriptor = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      return {
        label: 'Good Morning',
        icon: 'white-balance-sunny',
        message: 'Plan a fresh start to your day.',
        eyebrowColor: '#FFEBC8',
        subtitleColor: '#FFF8E1',
        iconColor: '#FFD166',
      };
    }
    if (hour >= 12 && hour < 17) {
      return {
        label: 'Good Afternoon',
        icon: 'weather-sunny-alert',
        message: 'Keep the momentum going this afternoon.',
        eyebrowColor: '#FFEDD5',
        subtitleColor: '#FFE4C4',
        iconColor: '#FBBF24',
      };
    }
    if (hour >= 17 && hour < 22) {
      return {
        label: 'Good Evening',
        icon: 'weather-sunset',
        message: 'Unwind with a quick health check-in.',
        eyebrowColor: '#E0E7FF',
        subtitleColor: '#DBEAFE',
        iconColor: '#F472B6',
      };
    }
    return {
      label: 'Good Night',
      icon: 'weather-night',
      message: 'Rest well—your care team is on watch.',
      eyebrowColor: '#C7D2FE',
      subtitleColor: '#E0E7FF',
      iconColor: '#93C5FD',
    };
  }, [currentTime]);

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch =
        !normalizedSearch ||
        doctor.name.toLowerCase().includes(normalizedSearch) ||
        doctor.specialty.toLowerCase().includes(normalizedSearch);

      const matchesSpecialty = activeSpecialty
        ? doctor.specialty.toLowerCase().includes(activeSpecialty)
        : true;

      return matchesSearch && matchesSpecialty;
    });
  }, [normalizedSearch, activeSpecialty]);

  const wellnessHighlights = [
    {
      label: 'Temperature',
      value: weather.loading ? '--' : weather.temp,
      status: weather.loading ? 'Updating...' : `${weather.condition} · ${patientMeta.city || 'Pune'}`,
      icon: 'weather-partly-cloudy',
      iconColor: '#2D7FF9', 
      background: mode === 'dark' ? 'rgba(45, 127, 249, 0.1)' : '#EFF6FF',
      statusColor: '#2D7FF9', 
    },
    {
      label: 'Air Quality',
      value: weather.loading ? '--' : weather.aqiLabel,
      status: weather.loading ? 'Fetching...' : weather.aqi,
      icon: 'leaf',
      iconColor: '#10B981', 
      background: mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
      statusColor: '#1B998B', // Teal status for AQI
    },
  ];

  const healthMetrics = [
    {
      label: 'Heart Rate',
      value: '72 bpm',
      status: 'Normal',
      icon: 'heart-pulse',
      iconColor: theme.danger,
      background: mode === 'dark' ? theme.softAccent : '#FFF4F4',
      accent: theme.danger,
    },
    {
      label: 'Blood Pressure',
      value: '120/80',
      status: 'Steady',
      icon: 'pulse',
      iconColor: theme.accent,
      background: mode === 'dark' ? theme.softAccent : '#F2F6FF',
      accent: theme.accent,
    },
  ];

  const specialties = [
    {
      title: 'Cardiology',
      icon: 'heart',
      iconColor: theme.danger,
      background: mode === 'dark' ? theme.softAccent : '#FFEFF2',
      query: 'cardio',
    },
    {
      title: 'Neurology',
      icon: 'brain',
      iconColor: theme.deepAccent,
      background: mode === 'dark' ? theme.softAccent : '#F5F0FF',
      query: 'neuro',
    },
    {
      title: 'Pediatrics',
      icon: 'baby-face-outline',
      iconColor: theme.accent,
      background: mode === 'dark' ? theme.softAccent : '#F1F7FF',
      query: 'pediatric',
    },
    {
      title: 'Orthopedic',
      icon: 'bone',
      iconColor: theme.success,
      background: mode === 'dark' ? theme.softAccent : '#F3FEF3',
      query: 'ortho',
    },
    {
      title: 'Dermatology',
      icon: 'flower',
      iconColor: theme.warning,
      background: mode === 'dark' ? theme.softAccent : '#FFF3F7',
      query: 'derma',
    },
  ];

  const handleSpecialtyPress = (query: string) => {
    setActiveSpecialty(prev => (prev === query ? null : query));
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleFormSubmit = (formData: BookingFormData) => {
    if (selectedDoctor) {
      console.log('Booking appointment with:', selectedDoctor.name, formData);
      setShowBookingForm(false);
      setSelectedDoctor(null);
    }
  };

  const handleQuickAction = (title: string) => {
    if (title === 'Book Appointment') {
       scrollViewRef.current?.scrollTo({ y: topDocsY, animated: true });
    } else if (title.includes('Talk to a Doctor')) {
      onOpenChat?.();
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.greetingCard, { backgroundColor: theme.hero }]}>
        <View style={styles.greetingCopy}>
          <View style={styles.greetingEyebrowRow}>
            <Icon
              name={greetingDescriptor.icon}
              size={16}
              color={greetingDescriptor.iconColor}
              style={styles.greetingEyebrowIcon}
            />
            <Text
              style={[styles.greetingEyebrow, { color: greetingDescriptor.eyebrowColor }]}
            >
              {greetingDescriptor.label}
            </Text>
          </View>
          <Text style={styles.greetingTitle}>{patientMeta.fullName}</Text>
          <Text
            style={[
              styles.greetingSubtitle,
              { color: greetingDescriptor.subtitleColor ?? theme.softAccent },
            ]}
          >
            {greetingDescriptor.message}
          </Text>
        </View>

        <View style={styles.greetingBadge}>
          <Icon
            name="bell-badge-outline"
            size={24}
            color={mode === 'dark' ? theme.textPrimary : '#FFFFFF'}
            accessibilityLabel="Notifications"
          />
        </View>
      </View>

      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Icon name="magnify" size={22} color={theme.textSecondary} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Search doctors, specialties..."
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <View style={styles.section}>
         <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Overview
          </Text>
        </View>
        <View style={styles.metricsGrid}>
          {wellnessHighlights.map(item => (
            <View
              key={item.label}
              style={[
                styles.metricCard,
                { backgroundColor: item.background },
              ]}
            >
              <View style={styles.metricHeaderRow}>
                <Icon
                  name={item.icon}
                  size={22}
                  color={item.iconColor ?? theme.textPrimary}
                />
                 <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  {item.label}
                </Text>
              </View>
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
                {item.value}
              </Text>
              <Text style={[styles.metricStatus, { color: item.statusColor ?? theme.accent }]}>
                {item.status}
              </Text>
            </View>
          ))}
          {healthMetrics.map(metric => (
            <View
              key={metric.label}
              style={[
                styles.metricCard,
                { backgroundColor: metric.background },
              ]}
            >
              <View style={styles.metricHeaderRow}>
                <Icon
                  name={metric.icon}
                  size={22}
                  color={metric.iconColor}
                />
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  {metric.label}
                </Text>
              </View>
              <Text style={[styles.metricValue, { color: metric.accent }]}>
                {metric.value}
              </Text>
              <Text style={[styles.metricStatus, { color: theme.textPrimary }]}>
                {metric.status}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Quick actions
        </Text>
        <QuickActions theme={theme} actions={quickActions} onActionPress={handleQuickAction}/>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Upcoming appointment
          </Text>
          <TouchableOpacity onPress={onSeeAllAppointments}>
            <Text style={[styles.sectionLink, { color: theme.accent }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.appointmentCard, { backgroundColor: theme.card }]}>
          <Icon
            name="video-outline"
            size={22}
            color={theme.success}
            style={styles.videoCallIcon}
          />
          <View
            style={[styles.appointmentBadge, { backgroundColor: theme.hero }]}
          >
            <Icon
              name="calendar-month-outline"
              size={20}
              color="#FFFFFF"
              style={styles.appointmentBadgeIcon}
            />
            <Text style={styles.appointmentBadgeText}>29 DEC</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={[styles.appointmentDoctor, { color: theme.textPrimary }]}>
              Dr. Aditi Rao
            </Text>
            <Text style={[styles.appointmentDetails, { color: theme.textSecondary }]}>
              Cardiology · 04:30 PM
            </Text>
            <View style={styles.appointmentActions}>
              <TouchableOpacity
                style={[styles.joinButton, { backgroundColor: theme.accent }]}
              >
                <Text style={[styles.joinButtonText, { color: mode === 'dark' ? theme.textPrimary : '#0F1F1A' }]}>
                  Join
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlinedButton, { borderColor: theme.border }]}
              >
                <Text style={[styles.outlinedButtonText, { color: theme.textPrimary }]}>
                  Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Specialties
          </Text>
          <TouchableOpacity onPress={onSeeAllSpecialties}>
            <Text style={[styles.sectionLink, { color: theme.accent }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.specialtyRow}>
            {specialties.map(item => {
              const isActive = activeSpecialty === item.query;
              return (
                <TouchableOpacity
                  key={item.title}
                  style={[
                    styles.specialtyPill,
                    { backgroundColor: item.background },
                    isActive && [
                      styles.specialtyPillActive,
                      { borderColor: theme.accent, backgroundColor: '#FFFFFF' },
                    ],
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSpecialtyPress(item.query)}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color={isActive ? theme.accent : item.iconColor}
                  />
                  <Text
                    style={[
                      styles.specialtyTitle,
                      {
                        color: isActive ? theme.accent : theme.textPrimary,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View
        style={styles.section}
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setTopDocsY(layout.y);
        }}
        ref={topDoctorsRef}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Top doctors
          </Text>
          <TouchableOpacity onPress={onSeeAllDoctors}>
            <Text style={[styles.sectionLink, { color: theme.accent }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {filteredDoctors.length ? (
          filteredDoctors.slice(0, 3).map(doctor => (
            <DoctorCard key={doctor.name} doctor={doctor} theme={theme} onBook={handleBookAppointment} />
          ))
        ) : (
          <View style={[styles.emptyState, { borderColor: theme.border }]}>
            <Text style={[styles.emptyStateTitle, { color: theme.textPrimary }]}>
              No doctors found
            </Text>
            <Text
              style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
              Try another name or specialty.
            </Text>
          </View>
        )}
      </View>

      {selectedDoctor && (
        <BookingForm
          visible={showBookingForm}
          doctor={selectedDoctor}
          theme={theme}
          onClose={() => setShowBookingForm(false)}
          onBookAppointment={handleFormSubmit}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 48,
    gap: 28,
  },
  greetingCard: {
    borderRadius: 32,
    padding: 24,
    paddingVertical: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  greetingCopy: {
    gap: 8,
    flex: 1,
    paddingRight: 16,
  },
  greetingEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greetingEyebrowIcon: {
    marginTop: -1,
  },
  greetingEyebrow: {
    color: '#D9E9FF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 11,
    fontWeight: '700',
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  greetingSubtitle: {
    color: '#E7F5FF',
    fontSize: 15,
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  greetingBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  greetingBadgeText: {
    fontSize: 22,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 12,
  },
  highlightCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  highlightIcon: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightIconText: {
    fontSize: 18,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  highlightValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  highlightStatus: {
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  searchIcon: {
    fontSize: 20,
  },
  voiceIcon: {
    fontSize: 20,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  appointmentCard: {
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed aligned so badge can be top
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  videoCallIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  appointmentBadge: {
    borderRadius: 20,
    width: 72,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  appointmentBadgeIcon: {
    marginBottom: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 6,
    borderRadius: 10,
  },
  appointmentBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  appointmentBadgeSub: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  appointmentInfo: {
    flex: 1,
    gap: 6,
    paddingTop: 4,
  },
  appointmentDoctor: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  appointmentDetails: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 12,
    opacity: 0.8,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  joinButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  joinButtonText: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  outlinedButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  outlinedButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  metricCard: {
    width: '48%',
    borderRadius: 26,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'space-between',
    minHeight: 140,
  },
  metricHeaderRow: {
    gap: 8,
    alignItems: 'flex-start',
  },
  metricIcon: {
    fontSize: 22,
    marginBottom: 0,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metricStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  specialtyRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  specialtyPill: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  specialtyPillActive: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  specialtyIcon: {
    fontSize: 18,
  },
  specialtyTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default PatientHome;