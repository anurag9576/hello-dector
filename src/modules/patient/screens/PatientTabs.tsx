import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './PatientHome';
import CalendarScreen from './Calendar';
import LabsScreen from './Labs';
import ProfileScreen from './Profile';
import ReportsScreen from './ReportsScreen';
import HelpCenter from './HelpCenter';
import Policies from './Policies';
import SettingsScreen from './SettingsScreen';
import ChatScreen from './Chat';
import DoctorListScreen from './DoctorListScreen';
import { ThemePalette } from '../../../theme/palette';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { addSession } from '../data';
import BookingForm, { BookingFormData } from '../components/BookingForm';

type TabKey = 'home' | 'calendar' | 'labs' | 'profile' | 'chat';

type DoctorListType = 'specialties' | 'top-doctors' | 'all' | null;

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-variant' },
  { key: 'calendar', label: 'Exam', icon: 'calendar-month' },
  { key: 'labs', label: 'Results', icon: 'flask-outline' },
  { key: 'chat', label: 'Chat', icon: 'message-text' },
  { key: 'profile', label: 'Profile', icon: 'account-circle' },
];

type ProfileMenuItem = {
  key: string;
  label: string;
  subtitle: string;
  icon: string;
  accent?: string;
};

const profileSections: { title: string; items: ProfileMenuItem[] }[] = [
  {
    title: 'Account',
    items: [
      {
        key: 'settings',
        label: 'Settings',
        subtitle: 'Notifications, privacy, reminders',
        icon: 'cog-outline',
      },
      {
        key: 'reports',
        label: 'Reports',
        subtitle: 'Download prescriptions & lab PDFs',
        icon: 'file-chart',
      },
      {
        key: 'top_doctors',
        label: 'Top Doctor',
        subtitle: 'Connect with expert specialists',
        icon: 'stethoscope',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        key: 'help',
        label: 'Help center',
        subtitle: 'Chat with a care guide 24/7',
        icon: 'lifebuoy',
      },
      {
        key: 'policy',
        label: 'Policies',
        subtitle: 'Privacy & telehealth guidelines',
        icon: 'shield-check',
      },
       {
        key: 'logout',
        label: 'Logout',
        subtitle: 'Securely log out of HelloDoctor',
        icon: 'login',
      },
    ],
  },
];

type ProfileTabProps = {
  theme: ThemePalette;
  onLogout: () => void;
  onProfilePress: () => void;
  onSettingsPress: () => void;
  onReportsPress: () => void;
  onTopDoctorsPress: () => void;
  onHelpPress: () => void;
  onPoliciesPress: () => void;
};

const ProfileTab: React.FC<ProfileTabProps> = ({
  theme,
  onLogout,
  onProfilePress,
  onSettingsPress,
  onReportsPress,
  onTopDoctorsPress,
  onHelpPress,
  onPoliciesPress,
}) => {
  const { patientMeta } = usePatientProfile();
  const handlePress = (item: ProfileMenuItem) => {
    if (item.key === 'logout') {
      Alert.alert('Sign out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: onLogout },
      ]);
      return;
    }
    if (item.key === 'settings') {
      onSettingsPress();
      return;
    }
    if (item.key === 'reports') {
      onReportsPress();
      return;
    }
    if (item.key === 'top_doctors') {
      onTopDoctorsPress();
      return;
    }
    if (item.key === 'help') {
      onHelpPress();
      return;
    }
    if (item.key === 'policy') {
      onPoliciesPress();
      return;
    }
    Alert.alert(item.label, `Opening ${item.label}…`);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.profileScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={[styles.profileAvatar, { backgroundColor: theme.accent }]}>
          <Text style={styles.profileInitials}>{patientMeta.initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.textPrimary }]}>
            {patientMeta.fullName}
          </Text>
          <Text style={[styles.profileMeta, { color: theme.textSecondary }]}>
            Patient id : {patientMeta.patientId}
          </Text>
          
        </View>
        <TouchableOpacity
          style={styles.profileChevron}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Icon name="chevron-right" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {profileSections.map(section => (
        <View
          key={section.title}
          style={[styles.profileSection, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            {section.title}
          </Text>
          {section.items.map(item => (
            <TouchableOpacity
              key={item.key}
              style={styles.profileRow}
              onPress={() => handlePress(item)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.profileIconWrap,
                  {
                    backgroundColor:
                      item.accent ?? 'rgba(19, 170, 119, 0.12)',
                  },
                ]}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={item.accent ?? theme.accent}
                />
              </View>
              <View style={styles.profileCopy}>
                <Text
                  style={[styles.profileTitle, { color: theme.textPrimary }]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[styles.profileSubtitle, { color: theme.textSecondary }]}
                >
                  {item.subtitle}
                </Text>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

type PatientTabsProps = {
  theme: ThemePalette;
  onLogout: () => void;
};

const PatientTabs: React.FC<PatientTabsProps> = ({ theme, onLogout }) => {
  const { patientMeta } = usePatientProfile();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDoctorListOpen, setIsDoctorListOpen] = useState(false);
  const [doctorListType, setDoctorListType] = useState<DoctorListType>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    const handleBack = () => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return true;
      }
      if (isReportsOpen) {
        setIsReportsOpen(false);
        return true;
      }
      if (isHelpCenterOpen) {
        setIsHelpCenterOpen(false);
        return true;
      }
      if (isPoliciesOpen) {
        setIsPoliciesOpen(false);
        return true;
      }
      if (isProfileOpen) {
        setIsProfileOpen(false);
        return true;
      }
      if (isChatOpen) {
        setIsChatOpen(false);
        return true;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBack,
    );
    return () => {
      subscription.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [activeTab, isProfileOpen, isSettingsOpen, isReportsOpen, isHelpCenterOpen, isPoliciesOpen, isChatOpen, isDoctorListOpen]);

  const handleTabPress = (tabKey: TabKey) => {
    if (isProfileOpen || isSettingsOpen || isReportsOpen || isHelpCenterOpen || isPoliciesOpen || isChatOpen || isDoctorListOpen) {
      setIsProfileOpen(false);
      setIsSettingsOpen(false);
      setIsReportsOpen(false);
      setIsHelpCenterOpen(false);
      setIsPoliciesOpen(false);
      setIsChatOpen(false);
      setIsDoctorListOpen(false);
      setDoctorListType(null);
    }
    setActiveTab(tabKey);
  };

  const handleSeeAllDoctors = () => {
    setDoctorListType('top-doctors');
    setIsDoctorListOpen(true);
  };

  const handleSeeAllSpecialties = () => {
    setDoctorListType('specialties');
    setIsDoctorListOpen(true);
  };

  const handleSeeAllAppointments = () => {
    setActiveTab('calendar');
  };

  const handleBookAppointment = (doctor: any, formData?: BookingFormData) => {
    // Create new appointment with form data
    const newAppointment = {
      date: formData?.preferredDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: formData?.preferredTime || '10:00 AM',
      title: `Consultation with ${doctor.name}`,
      doctor: doctor.name,
      notes: formData?.reasonForVisit || '',
      location: formData?.consultationType === 'video' ? 'Video Consultation' : 'HelloDoctor Clinic, Pune',
      preparation: formData?.consultationType === 'video' 
        ? ['Check internet connection', 'Test camera/microphone', 'Find quiet space']
        : ['Bring ID proof', 'Medical records'],
      consultationType: formData?.consultationType || 'in-person',
      patientName: formData?.patientName || patientMeta.fullName,
      patientPhone: formData?.phone || '',
      symptoms: formData?.symptoms || '',
      medicalHistory: formData?.medicalHistory || '',
      emergencyContact: formData?.emergencyContact || '',
    };
    
    // Add to sessions data
    addSession(newAppointment);
    
    // Close doctor list and go to calendar tab (Exam)
    setIsDoctorListOpen(false);
    setDoctorListType(null);
    setActiveTab('calendar');
    
    const consultationTypeText = formData?.consultationType === 'video' ? 'video consultation' : 
                               formData?.consultationType === 'phone' ? 'phone consultation' : 'in-person visit';
    
    Alert.alert(
      'Appointment Booked Successfully!', 
      `Your ${consultationTypeText} with ${doctor.name} is confirmed for ${newAppointment.date} at ${newAppointment.time}.\n\nCheck the Exam tab for details.`
    );
  };

  const renderContent = () => {
    if (isDoctorListOpen) {
      return (
        <DoctorListScreen
          theme={theme}
          onBack={() => {
            setIsDoctorListOpen(false);
            setDoctorListType(null);
          }}
          onBookAppointment={handleBookAppointment}
          type={doctorListType || 'all'}
        />
      );
    }
    if (isProfileOpen) {
      return (
        <ProfileScreen theme={theme} onBack={() => setIsProfileOpen(false)} />
      );
    }
    if (isSettingsOpen) {
      return (
        <SettingsScreen theme={theme} onBack={() => setIsSettingsOpen(false)} />
      );
    }
    if (isReportsOpen) {
      return (
        <ReportsScreen theme={theme} onBack={() => setIsReportsOpen(false)} />
      );
    }
    if (isHelpCenterOpen) {
      return (
        <HelpCenter theme={theme} onBack={() => setIsHelpCenterOpen(false)} />
      );
    }
    if (isPoliciesOpen) {
      return (
        <Policies theme={theme} onBack={() => setIsPoliciesOpen(false)} />
      );
    }
    if (isChatOpen) {
      return (
        <ChatScreen theme={theme} onBack={() => setIsChatOpen(false)} />
      );
    }
    switch (activeTab) {
      case 'calendar':
        return <CalendarScreen theme={theme} onBack={() => setActiveTab('home')} />;
      case 'labs':
        return <LabsScreen theme={theme} onBack={() => setActiveTab('home')} />;
      case 'chat':
        return <ChatScreen theme={theme} onBack={() => setActiveTab('home')} />;
      case 'profile':
        return (
          <ProfileTab
            theme={theme}
            onLogout={onLogout}
            onProfilePress={() => setIsProfileOpen(true)}
            onSettingsPress={() => setIsSettingsOpen(true)}
            onReportsPress={() => setIsReportsOpen(true)}
            onTopDoctorsPress={() => handleSeeAllDoctors()}
            onHelpPress={() => setIsHelpCenterOpen(true)}
            onPoliciesPress={() => setIsPoliciesOpen(true)}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen 
            theme={theme} 
            onSeeAllDoctors={handleSeeAllDoctors}
            onSeeAllSpecialties={handleSeeAllSpecialties}
            onSeeAllAppointments={handleSeeAllAppointments}
            onOpenChat={() => setActiveTab('chat')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      {!isKeyboardVisible && (
        <View
          style={[
            styles.tabBar,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              {tab.key === 'profile' ? (
                <View
                  style={[
                    styles.profileTabIconCircle,
                    {
                      borderColor: isActive ? theme.accent : theme.border,
                      backgroundColor: isActive ? theme.accent : 'transparent',
                    },
                  ]}
                >
                  <Icon
                    name={tab.icon}
                    size={18}
                    color={isActive ? theme.card : theme.textSecondary}
                  />
                </View>
              ) : (
                <Icon
                  name={tab.icon}
                  size={20}
                  color={isActive ? theme.accent : theme.textSecondary}
                  style={styles.tabIcon}
                />
              )}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? theme.accent : theme.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  profileScroll: {
    padding: 24,
    gap: 18,
  },
  profileCard: {
    borderRadius: 26,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#0F1F1A',
    fontSize: 22,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileMeta: {
    fontSize: 13,
  },
  profileChevron: {
    padding: 6,
  },
  profileSection: {
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginHorizontal: 12,
    marginBottom: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 12,
  },
  profileIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileSubtitle: {
    fontSize: 13,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  tabIcon: {
    fontSize: 20,
  },
  profileTabIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  tabLabel: {
    fontSize: 12,
  },
});

export default PatientTabs;
