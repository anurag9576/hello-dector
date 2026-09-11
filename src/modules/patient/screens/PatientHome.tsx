import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Animated as RNAnimated } from 'react-native';

import {
  Modal,
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
import { doctors as initialDoctors, Doctor } from '../../../data/doctors';
import { quickActions } from '../data';
import QuickActions from '../components/QuickActions';
import DoctorCard from '../components/DoctorCard';
import BookingForm, { BookingFormData } from '../components/BookingForm';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { useLiveWeather } from '../hooks/useLiveWeather';
import { useLocationCity } from '../hooks/useLocationCity';
import { getAllDoctors, notifyDoctor } from '../../../utils/api';

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
  const locationCity = useLocationCity(patientMeta.city || 'Pune');
  const detectedCity = locationCity.city || patientMeta.city || 'Pune';
  const weather = useLiveWeather(detectedCity);
  const topDoctorsRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [topDocsY, setTopDocsY] = useState(0);
  const [backendDoctors, setBackendDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [patientNotifications, setPatientNotifications] = useState<
    { id: string; title: string; message: string; time: string; read: boolean; icon: string }[]
  >([]);

  // Fetch doctors — runs immediately, re-runs when city resolves
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Pass city only if location finished loading
        const cityParam = !locationCity.loading ? detectedCity : undefined;
        console.log('Fetching doctors with city:', cityParam);
        const res = await getAllDoctors(cityParam);
        console.log('Doctors API response:', res?.success, 'count:', res?.count);
        if (res && res.success && res.profiles) {
          const mappedDoctors: Doctor[] = res.profiles.map((p: any) => {
            const clinic = p.basicInfo?.clinic || '';
            const city = clinic.includes(',') ? clinic.split(',').pop()?.trim() : clinic;
            return {
              name: p.basicInfo?.name || 'Unknown Doctor',
              specialty: p.basicInfo?.specialty || 'General',
              experience: p.basicInfo?.experience || 'N/A',
              rating: p.publicStats?.averageRating?.toString() || '0',
              availability: 'Available Soon',
              city: city || 'Pune',
              phone: p.userId?.phone || p.basicInfo?.phone || '',
              userId: p.userId?._id || p.userId || '',
            };
          });
          setBackendDoctors(mappedDoctors);
        }
      } catch (error) {
        console.log('Error fetching doctors:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [detectedCity, locationCity.loading]);

  const displayDoctors = backendDoctors.length > 0 ? backendDoctors : initialDoctors;

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
    return displayDoctors.filter((doctor: Doctor) => {
      const matchesSearch =
        !normalizedSearch ||
        doctor.name.toLowerCase().includes(normalizedSearch) ||
        doctor.specialty.toLowerCase().includes(normalizedSearch);

      const matchesSpecialty = activeSpecialty
        ? doctor.specialty.toLowerCase().includes(activeSpecialty)
        : true;

      return matchesSearch && matchesSpecialty;
    });
  }, [normalizedSearch, activeSpecialty, displayDoctors]);

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

  const handleFormSubmit = async (formData: BookingFormData) => {
    if (selectedDoctor) {
      console.log('Booking appointment with:', selectedDoctor.name, formData);

      // Send notification to doctor
      try {
        await notifyDoctor({
          doctorUserId: selectedDoctor.userId || '',
          type: 'appointment_booked',
          title: 'New Appointment Booked',
          message: `${formData.patientName} has booked a ${formData.consultationType} appointment on ${formData.preferredDate} at ${formData.preferredTime}.`,
          appointmentData: {
            patientName: formData.patientName,
            patientPhone: formData.phone,
            date: formData.preferredDate,
            time: formData.preferredTime,
            consultationType: formData.consultationType,
            symptoms: formData.symptoms || formData.reasonForVisit,
          },
        });
        console.log('✅ Doctor notified successfully');
      } catch (err) {
        console.log('⚠️ Failed to notify doctor:', err);
      }

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
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

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

        <TouchableOpacity
          style={styles.greetingBadge}
          onPress={() => setShowNotifications(true)}
          activeOpacity={0.7}
        >
          {patientNotifications.some(n => !n.read) && <View style={styles.notifDot} />}
          <Icon
            name="bell-outline"
            size={22}
            color={mode === 'dark' ? theme.textPrimary : '#FFFFFF'}
            accessibilityLabel="Notifications"
          />
        </TouchableOpacity>
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
                <View style={[styles.metricIconCircle, { backgroundColor: (item.iconColor ?? theme.textPrimary) + '20' }]}>
                  <Icon
                    name={item.icon}
                    size={20}
                    color={item.iconColor ?? theme.textPrimary}
                  />
                </View>
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
                <View style={[styles.metricIconCircle, { backgroundColor: metric.iconColor + '20' }]}>
                  <Icon
                    name={metric.icon}
                    size={20}
                    color={metric.iconColor}
                  />
                </View>
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  {metric.label}
                </Text>
              </View>
              <Text style={[styles.metricValue, { color: metric.accent }]}>
                {metric.value}
              </Text>
              <View style={styles.metricStatusRow}>
                <View style={[styles.statusDot, { backgroundColor: metric.accent }]} />
                <Text style={[styles.metricStatus, { color: theme.textPrimary }]}>
                  {metric.status}
                </Text>
              </View>
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
          {/* Top accent bar */}
          <View style={[styles.appointmentAccent, { backgroundColor: theme.hero }]} />
          <View style={styles.appointmentInner}>
            <View style={styles.videoCallBadge}>
              <Icon name="video-outline" size={20} color={theme.success} />
              <View style={[styles.liveDot, { backgroundColor: theme.success }]} />
            </View>
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
              <View style={styles.apptMetaRow}>
                <Icon name="heart-pulse" size={14} color={theme.danger} />
                <Text style={[styles.appointmentDetails, { color: theme.textSecondary }]}>
                  Cardiology
                </Text>
                <Text style={[styles.appointmentDot, { color: theme.textSecondary }]}>·</Text>
                <Icon name="clock-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.appointmentDetails, { color: theme.textSecondary }]}>
                  04:30 PM
                </Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity
                  style={[styles.joinButton, { backgroundColor: theme.accent }]}
                >
                  <Icon name="video" size={16} color={mode === 'dark' ? theme.textPrimary : '#FFFFFF'} />
                  <Text style={[styles.joinButtonText, { color: mode === 'dark' ? theme.textPrimary : '#FFFFFF' }]}>
                    Join Call
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.outlinedButton, { borderColor: theme.border }]}
                >
                  <Icon name="information-outline" size={16} color={theme.textPrimary} />
                  <Text style={[styles.outlinedButtonText, { color: theme.textPrimary }]}>
                    Details
                  </Text>
                </TouchableOpacity>
              </View>
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
                    {
                      backgroundColor: isActive ? theme.accent : item.background,
                      borderColor: isActive ? theme.accent : 'transparent',
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSpecialtyPress(item.query)}
                >
                  <View style={[styles.specialtyIconCircle, { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : item.iconColor + '20' }]}>
                    <Icon
                      name={item.icon}
                      size={18}
                      color={isActive ? '#FFFFFF' : item.iconColor}
                    />
                  </View>
                  <Text
                    style={[
                      styles.specialtyTitle,
                      {
                        color: isActive ? '#FFFFFF' : theme.textPrimary,
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
            Doctors in {detectedCity}
          </Text>
          <TouchableOpacity onPress={onSeeAllDoctors}>
            <Text style={[styles.sectionLink, { color: theme.accent }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {filteredDoctors.length ? (
          filteredDoctors.slice(0, 3).map((doctor: Doctor) => (
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

      {/* Notification Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.notifOverlay}>
          <View style={[styles.notifPanel, { backgroundColor: theme.card }]}>
            {/* Header */}
            <View style={styles.notifPanelHeader}>
              <Text style={[styles.notifPanelTitle, { color: theme.textPrimary }]}>
                Notifications
              </Text>
              <View style={styles.notifHeaderActions}>
                {patientNotifications.some(n => !n.read) && (
                  <TouchableOpacity
                    onPress={() =>
                      setPatientNotifications(prev =>
                        prev.map(n => ({ ...n, read: true })),
                      )
                    }
                  >
                    <Text style={[styles.notifMarkRead, { color: theme.accent }]}>
                      Mark all read
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.notifCloseBtn, { backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}
                  onPress={() => setShowNotifications(false)}
                >
                  <Icon name="close" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Notification List */}
            <ScrollView
              style={styles.notifList}
              showsVerticalScrollIndicator={false}
            >
              {patientNotifications.map(notif => (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    styles.notifItem,
                    {
                      backgroundColor: notif.read
                        ? 'transparent'
                        : theme.accent + '08',
                      borderBottomColor: theme.border,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() =>
                    setPatientNotifications(prev =>
                      prev.map(n =>
                        n.id === notif.id ? { ...n, read: true } : n,
                      ),
                    )
                  }
                >
                  <View
                    style={[
                      styles.notifItemIcon,
                      { backgroundColor: theme.accent + '12' },
                    ]}
                  >
                    <Icon name={notif.icon} size={20} color={theme.accent} />
                  </View>
                  <View style={styles.notifItemBody}>
                    <Text
                      style={[
                        styles.notifItemTitle,
                        {
                          color: theme.textPrimary,
                          fontWeight: notif.read ? '600' : '700',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {notif.title}
                    </Text>
                    <Text
                      style={[styles.notifItemMsg, { color: theme.textSecondary }]}
                      numberOfLines={2}
                    >
                      {notif.message}
                    </Text>
                    <Text
                      style={[styles.notifItemTime, { color: theme.textSecondary }]}
                    >
                      {notif.time}
                    </Text>
                  </View>
                  {!notif.read && (
                    <View
                      style={[styles.notifUnreadDot, { backgroundColor: theme.accent }]}
                    />
                  )}
                </TouchableOpacity>
              ))}
              {patientNotifications.length === 0 && (
                <View style={styles.notifEmpty}>
                  <Icon name="bell-off-outline" size={48} color={theme.textSecondary + '40'} />
                  <Text style={[styles.notifEmptyTitle, { color: theme.textPrimary }]}>
                    No notifications yet
                  </Text>
                  <Text style={[styles.notifEmptyMsg, { color: theme.textSecondary }]}>
                    You'll see appointment updates, reminders and health tips here.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  // ===== Greeting Card =====
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
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  greetingCopy: {
    gap: 8,
    flex: 1,
    paddingRight: 16,
    zIndex: 1,
  },
  greetingEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  greetingSubtitle: {
    color: '#E7F5FF',
    fontSize: 14,
    opacity: 0.85,
    lineHeight: 21,
    marginBottom: 4,
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
    zIndex: 1,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FF4757',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 2,
  },
  // ===== Legacy (kept for backwards compat) =====
  locationContainer: { flexDirection: 'row', marginTop: 4 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  locationText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  greetingBadgeText: { fontSize: 22 },
  highlightRow: { flexDirection: 'row', gap: 12 },
  highlightCard: { flex: 1, borderRadius: 24, padding: 20, gap: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  highlightIcon: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 6, paddingHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  highlightIconText: { fontSize: 18 },
  highlightLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7 },
  highlightValue: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  highlightStatus: { fontSize: 13, fontWeight: '700' },
  // ===== Search Bar =====
  searchBar: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  searchIcon: { fontSize: 20 },
  voiceIcon: { fontSize: 20 },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  // ===== Section =====
  section: { gap: 18 },
  sectionTitle: {
    fontSize: 21,
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
  // ===== Appointment Card =====
  appointmentCard: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  appointmentAccent: {
    height: 5,
    width: '100%',
  },
  appointmentInner: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  videoCallBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(22,163,74,0.1)',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.15)',
  },
  liveDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appointmentBadge: {
    borderRadius: 20,
    width: 68,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  appointmentBadgeIcon: {
    marginBottom: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 5,
    borderRadius: 8,
  },
  appointmentBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  appointmentBadgeSub: { color: '#FFFFFF', fontSize: 12 },
  appointmentInfo: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  appointmentDoctor: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  apptMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  appointmentDot: {
    fontSize: 16,
    fontWeight: '800',
  },
  appointmentDetails: {
    fontSize: 13,
    fontWeight: '500',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  joinButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  joinButtonText: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  outlinedButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 9,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  outlinedButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  // ===== Metrics =====
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  metricCard: {
    width: '48%',
    borderRadius: 24,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'space-between',
    minHeight: 145,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  metricHeaderRow: {
    gap: 8,
    alignItems: 'flex-start',
  },
  metricIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricIcon: { fontSize: 22, marginBottom: 0 },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.65,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metricStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  metricStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  // ===== Specialties =====
  specialtyRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  specialtyPill: {
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  specialtyPillActive: {
    borderWidth: 1.5,
    shadowOpacity: 0.08,
    elevation: 4,
  },
  specialtyIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialtyIcon: { fontSize: 18 },
  specialtyTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  // ===== Empty State =====
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
  // ===== Notification Modal =====
  notifOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  notifPanel: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '75%',
    paddingTop: 8,
    paddingBottom: 24,
    elevation: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
  },
  notifPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  notifPanelTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  notifHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifMarkRead: {
    fontSize: 13,
    fontWeight: '700',
  },
  notifCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifList: {
    paddingHorizontal: 16,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    gap: 14,
  },
  notifItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifItemBody: {
    flex: 1,
    gap: 3,
  },
  notifItemTitle: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  notifItemMsg: {
    fontSize: 13,
    lineHeight: 18,
  },
  notifItemTime: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.55,
    marginTop: 2,
  },
  notifUnreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginTop: 8,
  },
  notifEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  notifEmptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  notifEmptyMsg: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 24,
    opacity: 0.6,
  },
});

export default PatientHome;