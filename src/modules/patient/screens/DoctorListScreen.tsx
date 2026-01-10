import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { doctors, Doctor } from '../../../data/doctors';
import DoctorCard from '../components/DoctorCard';
import { sessions } from '../data';
import BookingForm, { BookingFormData } from '../components/BookingForm';

type DoctorListScreenProps = {
  theme: ThemePalette;
  onBack: () => void;
  onBookAppointment: (doctor: Doctor, formData?: BookingFormData) => void;
  type?: 'specialties' | 'top-doctors' | 'all';
  specialty?: string;
};

const DoctorListScreen: React.FC<DoctorListScreenProps> = ({
  theme,
  onBack,
  onBookAppointment,
  type = 'all',
  specialty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(specialty || null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const specialties = [
    { title: 'Cardiology', query: 'cardio', icon: 'heart', color: theme.danger },
    { title: 'Neurology', query: 'neuro', icon: 'brain', color: theme.deepAccent },
    { title: 'Pediatrics', query: 'pediatric', icon: 'baby-face-outline', color: theme.accent },
    { title: 'Orthopedic', query: 'ortho', icon: 'bone', color: theme.success },
    { title: 'Dermatology', query: 'derma', icon: 'flower', color: theme.warning },
  ];

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = !searchQuery.trim() || 
        doctor.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.trim().toLowerCase());

      const matchesSpecialty = activeSpecialty
        ? doctor.specialty.toLowerCase().includes(activeSpecialty)
        : true;

      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, activeSpecialty]);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleFormSubmit = (formData: BookingFormData) => {
    if (selectedDoctor) {
      onBookAppointment(selectedDoctor, formData);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'specialties':
        return 'Specialties';
      case 'top-doctors':
        return 'Top Doctors';
      default:
        return 'All Doctors';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.navBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.navLeft}>
          <TouchableOpacity style={styles.navButton} onPress={onBack}>
            <Icon name="arrow-left" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
            {getTitle()}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Icon name="magnify" size={20} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search doctors, specialties..."
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {type === 'all' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Filter by Specialty</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.specialtyRow}>
                {specialties.map(item => {
                  const isActive = activeSpecialty === item.query;
                  return (
                    <TouchableOpacity
                      key={item.title}
                      style={[
                        styles.specialtyPill,
                        { backgroundColor: isActive ? theme.accent : theme.background },
                        { borderColor: isActive ? theme.accent : theme.border },
                      ]}
                      onPress={() => setActiveSpecialty(prev => (prev === item.query ? null : item.query))}
                    >
                      <Icon
                        name={item.icon}
                        size={18}
                        color={isActive ? '#fff' : item.color}
                      />
                      <Text style={[
                        styles.specialtyTitle,
                        { color: isActive ? '#fff' : theme.textPrimary }
                      ]}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
            {filteredDoctors.length} doctors found
          </Text>
          
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <View key={doctor.name} style={styles.doctorCardWrapper}>
                <DoctorCard
                  doctor={doctor}
                  theme={theme}
                  onBook={handleBookAppointment}
                />
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <Icon name="doctor" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.textPrimary }]}>
                No doctors found
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedDoctor && (
        <BookingForm
          visible={showBookingForm}
          doctor={selectedDoctor}
          theme={theme}
          onClose={() => setShowBookingForm(false)}
          onBookAppointment={handleFormSubmit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  searchBar: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  specialtyRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  specialtyPill: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  specialtyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  doctorCardWrapper: {
    gap: 12,
    marginBottom: 16,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DoctorListScreen;
