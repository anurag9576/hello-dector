import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import DoctorHome from './DoctorHome';
import DoctorProfile from './DoctorProfile';
import DoctorChat from './DoctorChat';
import DoctorAppointments from './DoctorAppointments';
import DoctorCalendar from './DoctorCalendar';
import DoctorPatients from './DoctorPatients';
import DoctorPatientDetails, { PatientRecord } from './DoctorPatientDetails';

// Placeholder components for other tabs
const PlaceholderScreen = ({ title, theme }: { title: string; theme: ThemePalette }) => (
  <View style={[styles.placeholderContainer, { backgroundColor: theme.background }]}>
    <Text style={[styles.placeholderText, { color: theme.textPrimary }]}>{title}</Text>
    <Text style={[styles.placeholderSub, { color: theme.textSecondary }]}>Coming Soon</Text>
  </View>
);

type TabKey = 'home' | 'appointments' | 'patients' | 'profile' | 'chat';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-variant' },
  { key: 'appointments', label: 'Visits', icon: 'calendar-clock' },
  { key: 'chat', label: 'Chat', icon: 'message-text' },
  { key: 'patients', label: 'Patients', icon: 'account-group' },
  { key: 'profile', label: 'Profile', icon: 'account-circle' },
];

type DoctorTabsProps = {
  theme: ThemePalette;
  onLogout: () => void;
};

const DoctorTabs: React.FC<DoctorTabsProps> = ({ theme, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPatientRecord, setSelectedPatientRecord] = useState<PatientRecord | null>(null);

  const renderContent = () => {
    if (showCalendar && activeTab === 'home') {
      return <DoctorCalendar theme={theme} onBack={() => setShowCalendar(false)} />;
    }

    if (selectedPatientRecord && activeTab === 'patients') {
      return (
        <DoctorPatientDetails 
          theme={theme} 
          patient={selectedPatientRecord} 
          onBack={() => setSelectedPatientRecord(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <DoctorHome theme={theme} onLogout={onLogout} onViewCalendar={() => setShowCalendar(true)} />;
      case 'appointments':
        return <DoctorAppointments theme={theme} onBack={() => setActiveTab('home')} />;
      case 'chat':
        return <DoctorChat theme={theme} onBack={() => setActiveTab('home')} />;
      case 'patients':
        return <DoctorPatients theme={theme} onSelectPatient={(p) => setSelectedPatientRecord(p)} onBack={() => setActiveTab('home')} />;
      case 'profile':
        return <DoctorProfile theme={theme} onLogout={onLogout} onBack={() => setActiveTab('home')} />;
      default:
        return <DoctorHome theme={theme} onLogout={onLogout} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
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
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={isActive ? theme.accent : theme.textSecondary}
              />
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    height: 70,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholderSub: {
    fontSize: 14,
  },
});

export default DoctorTabs;
