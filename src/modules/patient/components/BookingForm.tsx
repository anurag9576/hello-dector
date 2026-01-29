import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Doctor } from '../../../data/doctors';
import { ThemePalette } from '../../../theme/palette';

type BookingFormProps = {
  visible: boolean;
  doctor: Doctor;
  theme: ThemePalette;
  onClose: () => void;
  onBookAppointment: (formData: BookingFormData) => void;
};

export type BookingFormData = {
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: string;
  symptoms: string;
  medicalHistory: string;
  medications: string;
  allergies: string;
  emergencyContact: string;
  insuranceProvider: string;
  policyNumber: string;
  reasonForVisit: string;
};

const BookingForm: React.FC<BookingFormProps> = ({
  visible,
  doctor,
  theme,
  onClose,
  onBookAppointment,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'in-person',
    symptoms: '',
    medicalHistory: '',
    medications: '',
    allergies: '',
    emergencyContact: '',
    insuranceProvider: '',
    policyNumber: '',
    reasonForVisit: '',
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const sections = [
    { title: 'Personal Information', icon: 'account' },
    { title: 'Appointment Details', icon: 'calendar-clock' },
    { title: 'Medical Information', icon: 'medical-bag' },
    { title: 'Insurance & Emergency', icon: 'shield-account' },
  ];

  const consultationTypes = [
    { value: 'in-person', label: 'In-Person Visit', icon: 'hospital-building' },
    { value: 'video', label: 'Video Consultation', icon: 'video' },
    { value: 'phone', label: 'Phone Consultation', icon: 'phone' },
  ];

  const genders = ['Male', 'Female', 'Other'];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  const updateFormData = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatDateForForm = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
    updateFormData('preferredDate', formatDateForForm(newDate));
    setShowDatePicker(false);
  };

  const validateForm = () => {
    const requiredFields = ['patientName', 'age', 'gender', 'phone', 'preferredDate', 'preferredTime'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof BookingFormData]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', `Please fill in: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onBookAppointment(formData);
      onClose();
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Personal Information
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Full Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.patientName}
                onChangeText={(value) => updateFormData('patientName', value)}
                placeholder="Enter your full name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Age *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                  value={formData.age}
                  onChangeText={(value) => updateFormData('age', value)}
                  placeholder="Age"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Gender *</Text>
                <TouchableOpacity
                  style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, { color: formData.gender ? theme.textPrimary : theme.textSecondary }]}>
                    {formData.gender || 'Select Gender'}
                  </Text>
                  <Icon 
                    name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={theme.textSecondary} 
                  />
                </TouchableOpacity>
                
                {showGenderDropdown && (
                  <View style={[styles.dropdownMenu, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    {genders.map((gender, index) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.dropdownItem,
                          { 
                            borderBottomColor: theme.border,
                            backgroundColor: formData.gender === gender ? theme.softAccent : 'transparent'
                          }
                        ]}
                        onPress={() => {
                          updateFormData('gender', gender);
                          setShowGenderDropdown(false);
                        }}
                      >
                        <Text style={[styles.dropdownItemText, { color: theme.textPrimary }]}>
                          {gender}
                        </Text>
                        {formData.gender === gender && (
                          <Icon name="check" size={18} color={theme.accent} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Phone Number *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="+91 98765 43210"
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="your.email@example.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Appointment Details
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Preferred Date *</Text>
              <TouchableOpacity
                style={[styles.datePicker, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Icon name="calendar" size={20} color={theme.accent} />
                <Text style={[styles.dateText, { color: formData.preferredDate ? theme.textPrimary : theme.textSecondary }]}>
                  {formData.preferredDate ? formatDate(selectedDate) : 'Select Date'}
                </Text>
                <Icon name="chevron-down" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
              
              {showDatePicker && (
                <View style={[styles.calendarModal, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Icon name="close" size={24} color={theme.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.calendarTitle, { color: theme.textPrimary }]}>
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Text>
                    <View style={{ width: 24 }} />
                  </View>
                  
                  <View style={styles.weekDays}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <Text key={index} style={[styles.weekDayText, { color: theme.textSecondary }]}>
                        {day}
                      </Text>
                    ))}
                  </View>
                  
                  <View style={styles.calendarDays}>
                    {generateCalendarDays().map((day, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dayCell,
                          {
                            backgroundColor: day === selectedDate.getDate() ? theme.accent : 'transparent',
                            borderColor: theme.border,
                          }
                        ]}
                        onPress={() => day && handleDateSelect(day)}
                        disabled={!day}
                      >
                        {day && (
                          <Text style={[
                            styles.dayText,
                            { color: day === selectedDate.getDate() ? '#fff' : theme.textPrimary }
                          ]}>
                            {day}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Preferred Time *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.timeRow}>
                  {timeSlots.map(time => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timePill,
                        {
                          backgroundColor: formData.preferredTime === time ? theme.accent : theme.background,
                          borderColor: formData.preferredTime === time ? theme.accent : theme.border,
                        }
                      ]}
                      onPress={() => updateFormData('preferredTime', time)}
                    >
                      <Text style={[
                        styles.timeText,
                        { color: formData.preferredTime === time ? '#fff' : theme.textPrimary }
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Consultation Type</Text>
              {consultationTypes.map(type => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.consultationCard,
                    {
                      backgroundColor: formData.consultationType === type.value ? theme.softAccent : theme.card,
                      borderColor: formData.consultationType === type.value ? theme.accent : theme.border,
                    }
                  ]}
                  onPress={() => updateFormData('consultationType', type.value)}
                >
                  <Icon name={type.icon} size={20} color={formData.consultationType === type.value ? theme.accent : theme.textSecondary} />
                  <Text style={[styles.consultationText, { color: theme.textPrimary }]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Reason for Visit</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.reasonForVisit}
                onChangeText={(value) => updateFormData('reasonForVisit', value)}
                placeholder="Describe your symptoms or reason for consultation..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Medical Information
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Current Symptoms</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.symptoms}
                onChangeText={(value) => updateFormData('symptoms', value)}
                placeholder="Describe your current symptoms..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Medical History</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.medicalHistory}
                onChangeText={(value) => updateFormData('medicalHistory', value)}
                placeholder="Previous illnesses, surgeries, conditions..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Current Medications</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.medications}
                onChangeText={(value) => updateFormData('medications', value)}
                placeholder="List current medications and dosages..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Allergies</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.allergies}
                onChangeText={(value) => updateFormData('allergies', value)}
                placeholder="Food allergies, medication allergies, etc..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Insurance & Emergency Contact
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Insurance Provider</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.insuranceProvider}
                onChangeText={(value) => updateFormData('insuranceProvider', value)}
                placeholder="Insurance company name"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Policy Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.policyNumber}
                onChangeText={(value) => updateFormData('policyNumber', value)}
                placeholder="Insurance policy number"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Emergency Contact</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={formData.emergencyContact}
                onChangeText={(value) => updateFormData('emergencyContact', value)}
                placeholder="Name and phone number"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Book Appointment
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.doctorInfo, { backgroundColor: theme.softAccent }]}>
          <Text style={[styles.doctorName, { color: theme.textPrimary }]}>{doctor.name}</Text>
          <Text style={[styles.doctorSpecialty, { color: theme.textSecondary }]}>{doctor.specialty}</Text>
          <View style={styles.doctorExtraInfo}>
            {doctor.city && (
              <View style={styles.doctorIconRow}>
                <Icon name="map-marker" size={12} color={theme.textSecondary} />
                <Text style={[styles.doctorExtraText, { color: theme.textSecondary }]}>{doctor.city}</Text>
              </View>
            )}
            {doctor.phone && (
              <View style={styles.doctorIconRow}>
                <Icon name="phone" size={12} color={theme.textSecondary} />
                <Text style={[styles.doctorExtraText, { color: theme.textSecondary }]}>{doctor.phone}</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderSection()}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <View style={styles.progress}>
            {sections.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: index <= currentSection ? theme.accent : theme.border,
                  }
                ]}
              />
            ))}
          </View>

          <View style={styles.footerButtons}>
            {currentSection > 0 && (
              <TouchableOpacity
                style={[styles.backButton, { borderColor: theme.border }]}
                onPress={() => setCurrentSection(currentSection - 1)}
              >
                <Text style={[styles.backButtonText, { color: theme.textPrimary }]}>Back</Text>
              </TouchableOpacity>
            )}

            {currentSection < sections.length - 1 ? (
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: theme.accent }]}
                onPress={() => setCurrentSection(currentSection + 1)}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.accent }]}
                onPress={handleSubmit}
              >
                <Icon name="check" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  doctorInfo: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
  },
  doctorSpecialty: {
    fontSize: 14,
    marginTop: 4,
  },
  doctorExtraInfo: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  doctorIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorExtraText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  datePicker: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    marginHorizontal: 12,
  },
  calendarModal: {
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 8,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  timePill: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  consultationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  consultationText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 16,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BookingForm;
