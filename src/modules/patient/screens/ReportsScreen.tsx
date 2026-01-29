import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Image,
  Linking,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type ReportsScreenProps = {
  theme: ThemePalette;
  onBack: () => void;
};

type Prescription = {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  medicines: string[];
  reminder?: {
    enabled: boolean;
    time: string;
    frequency: 'daily' | 'twice' | 'weekly';
  };
};

type LabReport = {
  id: string;
  date: string;
  testName: string;
  doctor: string;
  city: string;
  status: 'Normal' | 'Abnormal' | 'Pending';
  pdfUrl?: string;
};

const ReportsScreen: React.FC<ReportsScreenProps> = ({ theme, onBack }) => {
  const { mode } = useThemeContext();
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'labReports'>('prescriptions');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState<'doctor' | 'date'>('date');
  const [filterValue, setFilterValue] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderFrequency, setReminderFrequency] = useState<'daily' | 'twice' | 'weekly'>('daily');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPrescriptionUploadModal, setShowPrescriptionUploadModal] = useState(false);
  
  // Upload form state
  const [doctorName, setDoctorName] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState('');
  const [reportStatus, setReportStatus] = useState<'Normal' | 'Abnormal' | 'Pending'>('Normal');
  const [selectedFile, setSelectedFile] = useState<{name: string, uri: string} | null>(null);

  // Prescription upload form state
  const [prescriptionDoctorName, setPrescriptionDoctorName] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [prescriptionTime, setPrescriptionTime] = useState('09:00');
  const [prescriptionStatus, setPrescriptionStatus] = useState<'Active' | 'Completed' | 'Expired'>('Active');
  const [prescriptionDiagnosis, setPrescriptionDiagnosis] = useState('');
  const [prescriptionMedicines, setPrescriptionMedicines] = useState('');
  const [selectedPrescriptionFile, setSelectedPrescriptionFile] = useState<{name: string, uri: string} | null>(null);

  // Cities list for dropdown
  const cities = [
    { name: 'Mumbai', icon: 'city' },
    { name: 'Delhi', icon: 'city-variant' },
    { name: 'Bangalore', icon: 'city' },
    { name: 'Hyderabad', icon: 'city-variant-outline' },
    { name: 'Chennai', icon: 'city' },
    { name: 'Kolkata', icon: 'city-variant' },
    { name: 'Pune', icon: 'city-outline' },
    { name: 'Jaipur', icon: 'city' },
    { name: 'Lucknow', icon: 'city-variant-outline' },
    { name: 'Ahmedabad', icon: 'city' },
    { name: 'Surat', icon: 'city-outline' },
    { name: 'Kanpur', icon: 'city-variant' },
    { name: 'Nagpur', icon: 'city-outline' },
    { name: 'Indore', icon: 'city' },
    { name: 'Thane', icon: 'city-variant-outline' }
  ];

  // Status list for dropdown
  const statuses = [
    { name: 'Normal', icon: 'check-circle', color: 'success' },
    { name: 'Abnormal', icon: 'alert-circle', color: 'danger' },
    { name: 'Pending', icon: 'clock-outline', color: 'warning' }
  ];

  // Prescription status list for dropdown
  const prescriptionStatuses = [
    { name: 'Active', icon: 'play-circle', color: 'success' },
    { name: 'Completed', icon: 'check-circle', color: 'success' },
    { name: 'Expired', icon: 'close-circle', color: 'danger' }
  ];

  // Mock data - in real app this would come from API
  const prescriptions: Prescription[] = [
    {
      id: '1',
      date: '2024-12-20',
      doctor: 'Dr. Aditi Rao',
      diagnosis: 'Hypertension',
      medicines: ['Amlodipine 5mg', 'Losartan 50mg'],
    },
    {
      id: '2',
      date: '2024-12-15',
      doctor: 'Dr. Rajesh Kumar',
      diagnosis: 'Type 2 Diabetes',
      medicines: ['Metformin 500mg', 'Glimepiride 2mg'],
    },
    {
      id: '3',
      date: '2024-12-10',
      doctor: 'Dr. Priya Sharma',
      diagnosis: 'Vitamin D Deficiency',
      medicines: ['Vitamin D3 60,000 IU'],
    },
  ];

  const labReports: LabReport[] = [
    {
      id: '1',
      date: '2024-12-19',
      testName: 'Complete Blood Count',
      doctor: 'Dr. Aditi Rao',
      city: 'Mumbai',
      status: 'Normal',
      pdfUrl: '#',
    },
    {
      id: '2',
      date: '2024-12-16',
      testName: 'Liver Function Test',
      doctor: 'Dr. Rajesh Kumar',
      city: 'Delhi',
      status: 'Abnormal',
      pdfUrl: '#',
    },
    {
      id: '3',
      date: '2024-12-12',
      testName: 'Lipid Profile',
      doctor: 'Dr. Priya Sharma',
      city: 'Bangalore',
      status: 'Normal',
      pdfUrl: '#',
    },
  ];

  // Group prescriptions by date
  const groupedPrescriptions = prescriptions.reduce((groups, prescription) => {
    const date = prescription.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(prescription);
    return groups;
  }, {} as Record<string, Prescription[]>);

  const handleDownloadPDF = (item: Prescription | LabReport) => {
    Alert.alert('Download PDF', `Downloading PDF for ${item.id}...`);
    // In real app, implement actual download logic
  };

  const handleShareWithDoctor = (item: Prescription | LabReport) => {
    Alert.alert('Share with Doctor', `Sharing report with doctor...`);
    // In real app, implement sharing logic
  };

  const handleUploadNew = () => {
    setShowUploadModal(true);
  };

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.assets && result.assets[0] && result.assets[0].uri) {
        const photoUri = result.assets[0].uri;
        const fileName = `Photo_${new Date().getTime()}.jpg`;
        setSelectedFile({ name: fileName, uri: photoUri });
        Alert.alert(
          'Photo Captured!', 
          'Report photo captured successfully!'
        );
        console.log('Photo captured:', photoUri);
      }
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Failed to access camera. Please check your camera permissions.');
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.assets && result.assets[0] && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;
        const fileName = `Image_${new Date().getTime()}.jpg`;
        setSelectedFile({ name: fileName, uri: imageUri });
        Alert.alert(
          'Image Selected!', 
          'Report image selected successfully!'
        );
        console.log('Image selected:', imageUri);
      }
    } catch (error) {
      console.error('Gallery Error:', error);
      Alert.alert('Error', 'Failed to access gallery. Please check your gallery permissions.');
    }
  };

  const handleUploadPDF = async () => {
    try {
      Alert.alert('File Access', 'Opening file picker to select PDF report...');
      // In real app, implement document picker:
      // const result = await DocumentPicker.getDocumentAsync({
      //   type: ['application/pdf'],
      //   copyToCacheDirectory: true,
      // });
      // if (result.type === 'success') {
      //   // Handle the PDF file
      //   Alert.alert('PDF Selected', `PDF selected: ${result.name}`);
      // }
    } catch (error) {
      Alert.alert('Error', 'Failed to access files');
    }
  };

  const handlePrescriptionUpload = () => {
    setShowPrescriptionUploadModal(true);
  };

  const handleTakePrescriptionPhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.assets && result.assets[0] && result.assets[0].uri) {
        const photoUri = result.assets[0].uri;
        const fileName = `Prescription_Photo_${new Date().getTime()}.jpg`;
        setSelectedPrescriptionFile({ name: fileName, uri: photoUri });
        Alert.alert(
          'Prescription Photo Captured!', 
          'Prescription photo captured successfully!'
        );
        console.log('Prescription photo captured:', photoUri);
      }
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Failed to access camera. Please check your camera permissions.');
    }
  };

  const handleChoosePrescriptionFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      if (result.assets && result.assets[0] && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;
        const fileName = `Prescription_Image_${new Date().getTime()}.jpg`;
        setSelectedPrescriptionFile({ name: fileName, uri: imageUri });
        Alert.alert(
          'Prescription Image Selected!', 
          'Prescription image selected successfully!'
        );
        console.log('Prescription image selected:', imageUri);
      }
    } catch (error) {
      console.error('Gallery Error:', error);
      Alert.alert('Error', 'Failed to access gallery. Please check your gallery permissions.');
    }
  };

  const handleUploadPrescriptionPDF = async () => {
    try {
      Alert.alert('File Access', 'Opening file picker to select prescription PDF...');
      // In real app, implement document picker for prescription PDF
    } catch (error) {
      Alert.alert('Error', 'Failed to access files');
    }
  };

  const handleSetReminder = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    if (prescription.reminder) {
      setReminderTime(prescription.reminder.time);
      setReminderFrequency(prescription.reminder.frequency);
    }
    setShowReminderModal(true);
  };

  const handleSaveReminder = () => {
    if (selectedPrescription) {
      Alert.alert(
        'Reminder Set',
        `Reminder set for ${selectedPrescription.medicines.join(', ')} at ${reminderTime} (${reminderFrequency})`
      );
      // In real app, save to backend and schedule notification
    }
    setShowReminderModal(false);
    setSelectedPrescription(null);
  };

  const handleOpenTimePicker = () => {
    // Parse current time
    const [hours, minutes] = reminderTime.split(':').map(Number);
    setSelectedHour(hours);
    setSelectedMinute(minutes);
    setShowTimePicker(true);
  };

  const handleSaveTime = () => {
    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    setReminderTime(formattedTime);
    setShowTimePicker(false);
  };

  const renderPrescriptionItem = (prescription: Prescription) => (
    <View key={prescription.id} style={[styles.reportItem, { backgroundColor: theme.card }]}>
      <View style={styles.reportHeader}>
        <Text style={[styles.reportTitle, { color: theme.textPrimary }]}>
          {prescription.doctor}
        </Text>
        <Text style={[styles.reportDate, { color: theme.textSecondary }]}>
          {prescription.date}
        </Text>
      </View>
      <Text style={[styles.reportSubtitle, { color: theme.textSecondary }]}>
        {prescription.diagnosis}
      </Text>
      <View style={styles.medicinesList}>
        {prescription.medicines.map((medicine, index) => (
          <Text key={index} style={[styles.medicineItem, { color: theme.textPrimary }]}>
            • {medicine}
          </Text>
        ))}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.accent }]}
          onPress={() => handleDownloadPDF(prescription)}
        >
          <Icon name="download" size={16} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Download PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.border, borderWidth: 1 }]}
          onPress={() => handleShareWithDoctor(prescription)}
        >
          <Icon name="share-variant" size={16} color={theme.textPrimary} />
          <Text style={[styles.actionButtonText, { color: theme.textPrimary }]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { 
              backgroundColor: prescription.reminder?.enabled ? theme.success : theme.background,
              borderColor: theme.border,
              borderWidth: 1
            }
          ]}
          onPress={() => handleSetReminder(prescription)}
        >
          <Icon 
            name="bell-outline" 
            size={16} 
            color={prescription.reminder?.enabled ? '#FFFFFF' : theme.textPrimary} 
          />
          <Text style={[
            styles.actionButtonText, 
            { color: prescription.reminder?.enabled ? '#FFFFFF' : theme.textPrimary }
          ]}>
            {prescription.reminder?.enabled ? 'Reminder Set' : 'Set Reminder'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLabReportItem = (report: LabReport) => (
    <View key={report.id} style={[styles.reportItem, { backgroundColor: theme.card }]}>
      <View style={styles.reportHeader}>
        <Text style={[styles.reportTitle, { color: theme.textPrimary }]}>
          {report.testName}
        </Text>
        <View style={[
          styles.statusBadge,
          {
            backgroundColor: report.status === 'Normal' ? theme.success :
                           report.status === 'Abnormal' ? theme.danger : theme.warning
          }
        ]}>
          <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
            {report.status}
          </Text>
        </View>
      </View>
      <Text style={[styles.reportSubtitle, { color: theme.textSecondary }]}>
        Dr. {report.doctor} • {report.city} • {report.date}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.accent }]}
          onPress={() => handleDownloadPDF(report)}
        >
          <Icon name="download" size={16} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Download PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.border, borderWidth: 1 }]}
          onPress={() => handleShareWithDoctor(report)}
        >
          <Icon name="share-variant" size={16} color={theme.textPrimary} />
          <Text style={[styles.actionButtonText, { color: theme.textPrimary }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.navbar, { backgroundColor: theme.background }]}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
            Reports
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { borderColor: theme.border }]}
          onPress={() => setShowFilterModal(true)}
        >
          <Icon name="filter-variant" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'prescriptions' && [styles.activeTab, { backgroundColor: theme.accent }]
          ]}
          onPress={() => setActiveTab('prescriptions')}
        >
          <Icon name="prescription" size={16} color={activeTab === 'prescriptions' ? '#FFFFFF' : theme.textPrimary} />
          <Text style={[
            styles.tabText,
            activeTab === 'prescriptions' && { color: '#FFFFFF' }
          ]}>
            Prescriptions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'labReports' && [styles.activeTab, { backgroundColor: theme.accent }]
          ]}
          onPress={() => setActiveTab('labReports')}
        >
          <Icon name="file-document" size={16} color={activeTab === 'labReports' ? '#FFFFFF' : theme.textPrimary} />
          <Text style={[
            styles.tabText,
            activeTab === 'labReports' && { color: '#FFFFFF' }
          ]}>
            Lab Reports
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'prescriptions' ? (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: theme.success }]}
              onPress={handlePrescriptionUpload}
            >
              <Icon name="prescription" size={20} color="#FFFFFF" />
              <Text style={[styles.uploadButtonText, { color: '#FFFFFF' }]}>
                Upload Prescription
              </Text>
            </TouchableOpacity>
            
            {Object.entries(groupedPrescriptions).map(([date, dayPrescriptions]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={[styles.dateHeader, { color: theme.textPrimary }]}>
                  {date}
                </Text>
                {dayPrescriptions.map(renderPrescriptionItem)}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: theme.accent }]}
              onPress={handleUploadNew}
            >
              <Icon name="plus" size={20} color="#FFFFFF" />
              <Text style={[styles.uploadButtonText, { color: '#FFFFFF' }]}>
                Upload New Report
              </Text>
            </TouchableOpacity>
            
            {labReports.map(renderLabReportItem)}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Filter Reports
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterType === 'doctor' && [styles.selectedFilter, { backgroundColor: theme.accent + '20' }]
                ]}
                onPress={() => setFilterType('doctor')}
              >
                <Icon name="doctor" size={20} color={filterType === 'doctor' ? theme.accent : theme.textSecondary} />
                <Text style={[styles.filterOptionText, { color: theme.textPrimary }]}>
                  Filter by Doctor
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterType === 'date' && [styles.selectedFilter, { backgroundColor: theme.accent + '20' }]
                ]}
                onPress={() => setFilterType('date')}
              >
                <Icon name="calendar" size={20} color={filterType === 'date' ? theme.accent : theme.textSecondary} />
                <Text style={[styles.filterOptionText, { color: theme.textPrimary }]}>
                  Filter by Date
                </Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[
                styles.filterInput,
                { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }
              ]}
              placeholder={filterType === 'doctor' ? 'Enter doctor name...' : 'Enter date (YYYY-MM-DD)...'}
              placeholderTextColor={theme.textSecondary}
              value={filterValue}
              onChangeText={setFilterValue}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.accent }]}
                onPress={() => {
                  Alert.alert('Filter Applied', `Filtering by ${filterType}: ${filterValue}`);
                  setShowFilterModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Upload New Report
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowUploadModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.uploadForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Doctor Name
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }
                  ]}
                  placeholder="Enter doctor's name"
                  placeholderTextColor={theme.textSecondary}
                  value={doctorName}
                  onChangeText={setDoctorName}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Report Date
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => {
                    // In real app, implement date picker
                    Alert.alert('Date Picker', 'Date picker would open here');
                  }}
                >
                  <Icon name="calendar" size={20} color={theme.accent} />
                  <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                    {reportDate}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  City
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownInput,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => setShowCityModal(true)}
                >
                  <Icon name="map-marker" size={20} color={theme.accent} />
                  <Text style={[styles.dropdownText, { color: city ? theme.textPrimary : theme.textSecondary }]}>
                    {city || 'Select city'}
                  </Text>
                  <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Report Status
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownInput,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => setShowStatusModal(true)}
                >
                  <Icon 
                    name="information-outline" 
                    size={20} 
                    color={
                      reportStatus === 'Normal' ? theme.success :
                      reportStatus === 'Abnormal' ? theme.danger : theme.warning
                    } 
                  />
                  <Text style={[
                    styles.dropdownText, 
                    { 
                      color: reportStatus === 'Normal' ? theme.success :
                             reportStatus === 'Abnormal' ? theme.danger : theme.warning
                    }
                  ]}>
                    {reportStatus}
                  </Text>
                  <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Upload File
                </Text>
                <View style={styles.fileUploadOptions}>
                  <TouchableOpacity 
                    style={[styles.uploadOption, { borderColor: theme.border }]}
                    onPress={handleTakePhoto}
                  >
                    <Icon name="camera" size={32} color={theme.accent} />
                    <Text style={[styles.uploadOptionText, { color: theme.textPrimary }]}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.uploadOption, { borderColor: theme.border }]}
                    onPress={handleChooseFromGallery}
                  >
                    <Icon name="file-image" size={32} color={theme.accent} />
                    <Text style={[styles.uploadOptionText, { color: theme.textPrimary }]}>
                      Choose from Gallery
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.uploadOption, { borderColor: theme.border }]}
                    onPress={handleUploadPDF}
                  >
                    <Icon name="file-document-outline" size={32} color={theme.danger} />
                    <Text style={[styles.uploadOptionText, { color: theme.textPrimary }]}>
                      Upload PDF
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {selectedFile && (
                  <View style={[styles.selectedFile, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Icon name="file-document" size={20} color={theme.accent} />
                    <Text style={[styles.fileName, { color: theme.textPrimary }]}>
                      {selectedFile.name}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeFile}
                      onPress={() => setSelectedFile(null)}
                    >
                      <Icon name="close" size={16} color={theme.danger} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => {
                  // Reset form
                  setDoctorName('');
                  setReportDate(new Date().toISOString().split('T')[0]);
                  setCity('');
                  setReportStatus('Normal');
                  setSelectedFile(null);
                  setShowUploadModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.accent }]}
                onPress={() => {
                  if (!doctorName || !reportDate || !city || !selectedFile) {
                    Alert.alert('Missing Information', 'Please fill all fields and select a file.');
                    return;
                  }
                  Alert.alert(
                    'Report Uploaded!',
                    `Report uploaded successfully!\n\nDoctor: ${doctorName}\nDate: ${reportDate}\nCity: ${city}\nStatus: ${reportStatus}\nFile: ${selectedFile.name}`
                  );
                  // Reset form
                  setDoctorName('');
                  setReportDate(new Date().toISOString().split('T')[0]);
                  setCity('');
                  setReportStatus('Normal');
                  setSelectedFile(null);
                  setShowUploadModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Upload Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Select City
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCityModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.cityList} showsVerticalScrollIndicator={false}>
              {cities.map((cityOption) => (
                <TouchableOpacity
                  key={cityOption.name}
                  style={[
                    styles.cityOption,
                    city === cityOption.name && [
                      styles.selectedCityOption,
                      { backgroundColor: theme.accent + '15', borderColor: theme.accent }
                    ],
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => {
                    setCity(cityOption.name);
                    setShowCityModal(false);
                  }}
                >
                  <View style={styles.cityOptionContent}>
                    <View style={styles.cityIconContainer}>
                      <Icon 
                        name={cityOption.icon} 
                        size={24} 
                        color={city === cityOption.name ? theme.accent : theme.textSecondary} 
                      />
                    </View>
                    <Text style={[
                      styles.cityName,
                      { color: city === cityOption.name ? theme.accent : theme.textPrimary }
                    ]}>
                      {cityOption.name}
                    </Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: city === cityOption.name ? theme.accent : theme.border }
                    ]}>
                      {city === cityOption.name && (
                        <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setShowCityModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Status Selection Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Select Status
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statusList}>
              {statuses.map((statusOption) => (
                <TouchableOpacity
                  key={statusOption.name}
                  style={[
                    styles.statusOption,
                    reportStatus === statusOption.name && [
                      styles.selectedStatusOption,
                      { 
                        backgroundColor: statusOption.color === 'success' ? theme.success + '15' :
                                       statusOption.color === 'danger' ? theme.danger + '15' : 
                                       theme.warning + '15',
                        borderColor: statusOption.color === 'success' ? theme.success :
                                    statusOption.color === 'danger' ? theme.danger : 
                                    theme.warning
                      }
                    ],
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => {
                    setReportStatus(statusOption.name as 'Normal' | 'Abnormal' | 'Pending');
                    setShowStatusModal(false);
                  }}
                >
                  <View style={styles.statusOptionContent}>
                    <View style={styles.statusIconContainer}>
                      <Icon 
                        name={statusOption.icon} 
                        size={24} 
                        color={reportStatus === statusOption.name ? 
                          (statusOption.color === 'success' ? theme.success :
                           statusOption.color === 'danger' ? theme.danger : theme.warning) : 
                          theme.textSecondary} 
                      />
                    </View>
                    <Text style={[
                      styles.statusName,
                      { color: reportStatus === statusOption.name ? 
                        (statusOption.color === 'success' ? theme.success :
                         statusOption.color === 'danger' ? theme.danger : theme.warning) : 
                        theme.textPrimary }
                    ]}>
                      {statusOption.name}
                    </Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: reportStatus === statusOption.name ? 
                        (statusOption.color === 'success' ? theme.success :
                         statusOption.color === 'danger' ? theme.danger : theme.warning) : 
                        theme.border }
                    ]}>
                      {reportStatus === statusOption.name && (
                        <View style={[styles.radioInner, { 
                          backgroundColor: statusOption.color === 'success' ? theme.success :
                                         statusOption.color === 'danger' ? theme.danger : 
                                         theme.warning 
                        }]} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Prescription Upload Modal */}
      <Modal
        visible={showPrescriptionUploadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPrescriptionUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Upload Prescription
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPrescriptionUploadModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.uploadForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Doctor Name
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }
                  ]}
                  placeholder="Enter doctor's name"
                  placeholderTextColor={theme.textSecondary}
                  value={prescriptionDoctorName}
                  onChangeText={setPrescriptionDoctorName}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Prescription Date
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => {
                    Alert.alert('Date Picker', 'Date picker would open here');
                  }}
                >
                  <Icon name="calendar" size={20} color={theme.accent} />
                  <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                    {prescriptionDate}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Prescription Time
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Icon name="clock" size={20} color={theme.accent} />
                  <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                    {prescriptionTime}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Prescription Status
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownInput,
                    { backgroundColor: theme.background, borderColor: theme.border }
                  ]}
                  onPress={() => setShowStatusModal(true)}
                >
                  <Icon 
                    name="information-outline" 
                    size={20} 
                    color={
                      prescriptionStatus === 'Active' ? theme.success :
                      prescriptionStatus === 'Completed' ? theme.success : theme.danger
                    } 
                  />
                  <Text style={[
                    styles.dropdownText, 
                    { 
                      color: prescriptionStatus === 'Active' ? theme.success :
                             prescriptionStatus === 'Completed' ? theme.success : theme.danger
                    }
                  ]}>
                    {prescriptionStatus}
                  </Text>
                  <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Diagnosis
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }
                  ]}
                  placeholder="Enter diagnosis"
                  placeholderTextColor={theme.textSecondary}
                  value={prescriptionDiagnosis}
                  onChangeText={setPrescriptionDiagnosis}
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Medicines (comma separated)
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }
                  ]}
                  placeholder="e.g., Medicine 1 5mg, Medicine 2 10mg"
                  placeholderTextColor={theme.textSecondary}
                  value={prescriptionMedicines}
                  onChangeText={setPrescriptionMedicines}
                  multiline
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  Upload Prescription File
                </Text>
                <View style={styles.fileUploadOptions}>
                  <TouchableOpacity 
                    style={[styles.uploadOption, { borderColor: theme.border }]}
                    onPress={handleTakePrescriptionPhoto}
                  >
                    <Icon name="camera" size={32} color={theme.accent} />
                    <Text style={[styles.uploadOptionText, { color: theme.textPrimary }]}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.uploadOption, { borderColor: theme.border }]}
                    onPress={handleChoosePrescriptionFromGallery}
                  >
                    <Icon name="file-image" size={32} color={theme.accent} />
                    <Text style={[styles.uploadOptionText, { color: theme.textPrimary }]}>
                      Choose from Gallery
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.uploadOption, { borderColor: theme.border }]}
                    onPress={handleUploadPrescriptionPDF}
                  >
                    <Icon name="file-document-outline" size={32} color={theme.danger} />
                    <Text style={[styles.uploadOptionText, { color: theme.textPrimary }]}>
                      Upload PDF
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {selectedPrescriptionFile && (
                  <View style={[styles.selectedFile, { backgroundColor: theme.background, borderColor: theme.border }]}>
                    <Icon name="file-document" size={20} color={theme.accent} />
                    <Text style={[styles.fileName, { color: theme.textPrimary }]}>
                      {selectedPrescriptionFile.name}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeFile}
                      onPress={() => setSelectedPrescriptionFile(null)}
                    >
                      <Icon name="close" size={16} color={theme.danger} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => {
                  // Reset form
                  setPrescriptionDoctorName('');
                  setPrescriptionDate(new Date().toISOString().split('T')[0]);
                  setPrescriptionTime('09:00');
                  setPrescriptionStatus('Active');
                  setPrescriptionDiagnosis('');
                  setPrescriptionMedicines('');
                  setSelectedPrescriptionFile(null);
                  setShowPrescriptionUploadModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.success }]}
                onPress={() => {
                  if (!prescriptionDoctorName || !prescriptionDate || !prescriptionDiagnosis || !prescriptionMedicines || !selectedPrescriptionFile) {
                    Alert.alert('Missing Information', 'Please fill all fields and select a file.');
                    return;
                  }
                  Alert.alert(
                    'Prescription Uploaded!',
                    `Prescription uploaded successfully!\n\nDoctor: ${prescriptionDoctorName}\nDate: ${prescriptionDate}\nTime: ${prescriptionTime}\nStatus: ${prescriptionStatus}\nDiagnosis: ${prescriptionDiagnosis}\nMedicines: ${prescriptionMedicines}\nFile: ${selectedPrescriptionFile.name}`
                  );
                  // Reset form
                  setPrescriptionDoctorName('');
                  setPrescriptionDate(new Date().toISOString().split('T')[0]);
                  setPrescriptionTime('09:00');
                  setPrescriptionStatus('Active');
                  setPrescriptionDiagnosis('');
                  setPrescriptionMedicines('');
                  setSelectedPrescriptionFile(null);
                  setShowPrescriptionUploadModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Upload Prescription</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reminder Modal */}
      <Modal
        visible={showReminderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Set Medicine Reminder
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowReminderModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {selectedPrescription && (
              <View style={styles.reminderContent}>
                <View style={[styles.reminderMedicines, { backgroundColor: theme.background }]}>
                  <Text style={[styles.reminderLabel, { color: theme.textSecondary }]}>
                    Medicines:
                  </Text>
                  {selectedPrescription.medicines.map((medicine, index) => (
                    <Text key={index} style={[styles.reminderMedicine, { color: theme.textPrimary }]}>
                      • {medicine}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.reminderField}>
                  <Text style={[styles.reminderLabel, { color: theme.textSecondary }]}>
                    Reminder Time:
                  </Text>
                  <TouchableOpacity
                    style={[styles.timeSelector, { backgroundColor: theme.background, borderColor: theme.border }]}
                    onPress={handleOpenTimePicker}
                  >
                    <Icon name="clock" size={20} color={theme.accent} />
                    <Text style={[styles.timeText, { color: theme.textPrimary }]}>
                      {reminderTime}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.reminderField}>
                  <Text style={[styles.reminderLabel, { color: theme.textSecondary }]}>
                    Frequency:
                  </Text>
                  <View style={styles.frequencyOptions}>
                    {[
                      { key: 'daily', label: 'Daily' },
                      { key: 'twice', label: 'Twice Daily' },
                      { key: 'weekly', label: 'Weekly' }
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.key}
                        style={[
                          styles.frequencyOption,
                          reminderFrequency === option.key && [
                            styles.selectedFrequency,
                            { backgroundColor: theme.accent + '20', borderColor: theme.accent }
                          ],
                          { backgroundColor: theme.background, borderColor: theme.border }
                        ]}
                        onPress={() => setReminderFrequency(option.key as 'daily' | 'twice' | 'weekly')}
                      >
                        <Text style={[
                          styles.frequencyText,
                          { color: reminderFrequency === option.key ? theme.accent : theme.textPrimary }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setShowReminderModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.accent }]}
                onPress={handleSaveReminder}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Set Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Select Time
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.timePickerContent}>
              <View style={styles.timeDisplay}>
                <Text style={[styles.timeDisplayText, { color: theme.textPrimary }]}>
                  {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')}
                </Text>
              </View>
              
              <View style={styles.timePickerContainer}>
                <View style={styles.timeColumn}>
                  <Text style={[styles.timeColumnLabel, { color: theme.textSecondary }]}>
                    Hour
                  </Text>
                  <ScrollView style={styles.timeScroll}>
                    {[...Array(24)].map((_, hour) => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.timeOption,
                          selectedHour === hour && [
                            styles.selectedTimeOption,
                            { backgroundColor: theme.accent + '20' }
                          ]
                        ]}
                        onPress={() => setSelectedHour(hour)}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          { color: selectedHour === hour ? theme.accent : theme.textPrimary }
                        ]}>
                          {hour.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <Text style={[styles.timeSeparator, { color: theme.textPrimary }]}>:</Text>
                
                <View style={styles.timeColumn}>
                  <Text style={[styles.timeColumnLabel, { color: theme.textSecondary }]}>
                    Minute
                  </Text>
                  <ScrollView style={styles.timeScroll}>
                    {[...Array(60)].map((_, minute) => (
                      <TouchableOpacity
                        key={minute}
                        style={[
                          styles.timeOption,
                          selectedMinute === minute && [
                            styles.selectedTimeOption,
                            { backgroundColor: theme.accent + '20' }
                          ]
                        ]}
                        onPress={() => setSelectedMinute(minute)}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          { color: selectedMinute === minute ? theme.accent : theme.textPrimary }
                        ]}>
                          {minute.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.accent }]}
                onPress={handleSaveTime}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Set Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: 25,
    borderBottomWidth: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  section: {
    gap: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateGroup: {
    gap: 12,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  reportItem: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  reportDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  reportSubtitle: {
    fontSize: 14,
  },
  medicinesList: {
    gap: 4,
  },
  medicineItem: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  filterOptions: {
    gap: 12,
    marginBottom: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  selectedFilter: {
    borderRadius: 12,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadOptions: {
    gap: 16,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    justifyContent: 'flex-start',
  },
  uploadOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reminderContent: {
    gap: 20,
  },
  reminderMedicines: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  reminderLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  reminderMedicine: {
    fontSize: 14,
  },
  reminderField: {
    gap: 12,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  selectedFrequency: {
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timePickerContent: {
    gap: 24,
  },
  timeDisplay: {
    alignItems: 'center',
    padding: 20,
  },
  timeDisplayText: {
    fontSize: 48,
    fontWeight: '300',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeColumnLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeScroll: {
    height: 200,
    width: '100%',
  },
  timeOption: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedTimeOption: {
    borderRadius: 8,
  },
  timeOptionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: '300',
    marginHorizontal: 8,
  },
  uploadForm: {
    gap: 16,
    maxHeight: 500,
  },
  formField: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  fileUploadOptions: {
    flexDirection: 'column',
    gap: 8,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginTop: 12,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  removeFile: {
    padding: 4,
  },
  cityList: {
    maxHeight: 300,
    marginVertical: 10,
  },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 4,
  },
  selectedCityOption: {
    borderWidth: 1,
  },
  cityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusList: {
    marginVertical: 10,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 4,
  },
  selectedStatusOption: {
    borderWidth: 1,
  },
  statusOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportsScreen;
