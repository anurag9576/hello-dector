import React, { useEffect, useMemo, useState } from 'react';

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
import { doctors } from '../../../data/doctors';
import { quickActions } from '../data';
import QuickActions from '../components/QuickActions';
import DoctorCard from '../components/DoctorCard';

Icon.loadFont();

type PatientHomeProps = {
  theme: ThemePalette;
};

const PatientHome: React.FC<PatientHomeProps> = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

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
      value: '28°C',
      status: 'Light breeze',
      icon: 'weather-partly-cloudy',
      iconColor: '#2D7FF9',
      background: '#EEF4FF',
    },
    {
      label: 'Air Quality',
      value: 'Good',
      status: 'AQI 42',
      icon: 'leaf',
      iconColor: '#2ECC71',
      background: '#ECFDF5',
    },
  ];

  const healthMetrics = [
    {
      label: 'Heart Rate',
      value: '72 bpm',
      status: 'Normal',
      icon: 'heart-pulse',
      iconColor: '#FF6B6B',
      background: '#FFF4F4',
      accent: '#FF6B6B',
    },
    {
      label: 'Blood Pressure',
      value: '120/80',
      status: 'Steady',
      icon: 'pulse',
      iconColor: '#FF4D67',
      background: '#F2F6FF',
      accent: '#2D7FF9',
    },
  ];

  const specialties = [
    {
      title: 'Cardiology',
      icon: 'heart',
      iconColor: '#FF4D67',
      background: '#FFEFF2',
      query: 'cardio',
    },
    {
      title: 'Neurology',
      icon: 'brain',
      iconColor: '#7C4DFF',
      background: '#F5F0FF',
      query: 'neuro',
    },
    {
      title: 'Pediatrics',
      icon: 'baby-face-outline',
      iconColor: '#4C8BF5',
      background: '#F1F7FF',
      query: 'pediatric',
    },
    {
      title: 'Orthopedic',
      icon: 'bone',
      iconColor: '#1F8F5F',
      background: '#F3FEF3',
      query: 'ortho',
    },
    {
      title: 'Dermatology',
      icon: 'flower',
      iconColor: '#FF80AB',
      background: '#FFF3F7',
      query: 'derma',
    },
  ];

  const handleSpecialtyPress = (query: string) => {
    setActiveSpecialty(prev => (prev === query ? null : query));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.greetingCard, { backgroundColor: theme.hero }]}>
        <View style={styles.greetingCopy}>
          <View style={styles.greetingEyebrowRow}>
            <Icon
              name={greetingDescriptor.icon}
              size={18}
              color={greetingDescriptor.iconColor}
              style={styles.greetingEyebrowIcon}
            />
            <Text
              style={[styles.greetingEyebrow, { color: greetingDescriptor.eyebrowColor }]}
            >
              {greetingDescriptor.label}
            </Text>
          </View>
          <Text style={styles.greetingTitle}>John Doe</Text>
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
            color="#FFFFFF"
            accessibilityLabel="Notifications"
          />
        </View>
      </View>

      <View style={styles.highlightRow}>
        {wellnessHighlights.map(item => (
          <View
            key={item.label}
            style={[styles.highlightCard, { backgroundColor: item.background }]}
          >
            <View style={styles.highlightIcon}>
              <Icon
                name={item.icon}
                size={22}
                color={item.iconColor ?? theme.textPrimary}
              />
            </View>
            <Text style={[styles.highlightLabel, { color: theme.textSecondary }]}>
              {item.label}
            </Text>
            <Text style={[styles.highlightValue, { color: theme.textPrimary }]}>
              {item.value}
            </Text>
            <Text style={[styles.highlightStatus, { color: theme.accent }]}>
              {item.status}
            </Text>
          </View>
        ))}
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
        <Icon name="magnify" size={20} color={theme.textSecondary} />
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
            Health metrics
          </Text>
          <Text style={[styles.sectionLink, { color: theme.accent }]}>
            Insights
          </Text>
        </View>
        <View style={styles.metricsGrid}>
          {healthMetrics.map(metric => (
            <View
              key={metric.label}
              style={[
                styles.metricCard,
                { backgroundColor: metric.background },
              ]}
            >
              <Icon
                name={metric.icon}
                size={24}
                color={metric.iconColor}
                style={styles.metricIcon}
              />
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                {metric.label}
              </Text>
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
        <QuickActions theme={theme} actions={quickActions} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Upcoming appointment
          </Text>
          <Text style={[styles.sectionLink, { color: theme.accent }]}>See all</Text>
        </View>
        <View style={[styles.appointmentCard, { backgroundColor: theme.card }]}>
          <Icon
            name="video-outline"
            size={22}
            color="#42d05fff"
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
                <Text style={[styles.joinButtonText, { color: '#0F1F1A' }]}>
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
          <Text style={[styles.sectionLink, { color: theme.accent }]}>See all</Text>
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

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Top doctors
          </Text>
          <Text style={[styles.sectionLink, { color: theme.accent }]}>See all</Text>
        </View>
        {filteredDoctors.length ? (
          filteredDoctors.map(doctor => (
            <DoctorCard key={doctor.name} doctor={doctor} theme={theme} />
          ))
        ) : (
          <View style={[styles.emptyState, { borderColor: theme.border }]}>
            <Text style={[styles.emptyStateTitle, { color: theme.textPrimary }]}>
              No doctors found
            </Text>
            <Text
              style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}
            >
              Try another name or specialty.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 28,
  },
  greetingCard: {
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingCopy: {
    gap: 6,
  },
  greetingEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingEyebrowIcon: {
    marginTop: -2,
  },
  greetingEyebrow: {
    color: '#D9E9FF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 13,
  },
  greetingTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  greetingSubtitle: {
    color: '#E7F5FF',
    fontSize: 14,
  },
  greetingBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingBadgeText: {
    fontSize: 22,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 16,
  },
  highlightCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    gap: 6,
  },
  highlightIcon: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  highlightIconText: {
    fontSize: 18,
  },
  highlightLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  highlightStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchBar: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchIcon: {
    fontSize: 18,
  },
  voiceIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 15,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentCard: {
    borderRadius: 28,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    position: 'relative',
  },
  videoCallIcon: {
    position: 'absolute',
    top: 2,
    right: 20,
    backgroundColor: '#F4FFF8',
    padding: 8,
    borderRadius: 16,
  },
  appointmentBadge: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: -10,
    marginRight: 8,
  },
  appointmentBadgeIcon: {
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 6,
    borderRadius: 12,
  },
  appointmentBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  appointmentBadgeSub: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  appointmentInfo: {
    flex: 1,
    gap: 8,
  },
  appointmentDoctor: {
    fontSize: 18,
    fontWeight: '700',
  },
  appointmentDetails: {
    fontSize: 14,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  joinButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  outlinedButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  outlinedButtonText: {
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  metricCard: {
    width: '48%',
    borderRadius: 22,
    padding: 16,
    gap: 6,
  },
  metricIcon: {
    fontSize: 22,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  metricStatus: {
    fontSize: 13,
  },
  specialtyRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  specialtyPill: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specialtyPillActive: {
    borderWidth: 1,
  },
  specialtyIcon: {
    fontSize: 18,
  },
  specialtyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyStateSubtitle: {
    fontSize: 14,
  },
});

export default PatientHome;