import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './PatientHome';
import CalendarScreen from './Calendar';
import LabsScreen from './Labs';
import ProfileScreen from './Profile';
import { ThemePalette } from '../../../theme/palette';
import { patientMeta } from './user_profile_data';

type TabKey = 'home' | 'calendar' | 'labs' | 'profile';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-variant' },
  { key: 'calendar', label: 'Exam', icon: 'calendar-month' },
  { key: 'labs', label: 'Results', icon: 'flask-outline' },
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
};

const ProfileTab: React.FC<ProfileTabProps> = ({
  theme,
  onLogout,
  onProfilePress,
}) => {
  const handlePress = (item: ProfileMenuItem) => {
    if (item.key === 'logout') {
      Alert.alert('Sign out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: onLogout },
      ]);
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
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleBack = () => {
      if (isProfileOpen) {
        setIsProfileOpen(false);
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
    return () => subscription.remove();
  }, [activeTab, isProfileOpen]);

  const handleTabPress = (tabKey: TabKey) => {
    if (isProfileOpen) {
      setIsProfileOpen(false);
    }
    setActiveTab(tabKey);
  };

  const renderContent = () => {
    if (isProfileOpen) {
      return (
        <ProfileScreen theme={theme} onBack={() => setIsProfileOpen(false)} />
      );
    }
    switch (activeTab) {
      case 'calendar':
        return <CalendarScreen theme={theme} onBack={() => setActiveTab('home')} />;
      case 'labs':
        return <LabsScreen theme={theme} />;
      case 'profile':
        return (
          <ProfileTab
            theme={theme}
            onLogout={onLogout}
            onProfilePress={() => setIsProfileOpen(true)}
          />
        );
      case 'home':
      default:
        return <HomeScreen theme={theme} />;
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
