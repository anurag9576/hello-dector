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

type TabKey = 'home' | 'calendar' | 'labs' | 'more';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-variant' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar-month' },
  { key: 'labs', label: 'Labs', icon: 'flask-outline' },
  { key: 'more', label: 'More', icon: 'dots-horizontal' },
];

type MoreItem = {
  key: string;
  label: string;
  subtitle: string;
  icon: string;
  accent?: string;
};

const moreSections: { title: string; items: MoreItem[] }[] = [
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

type MoreTabProps = {
  theme: ThemePalette;
  onLogout: () => void;
  onProfilePress: () => void;
};

const MoreTab: React.FC<MoreTabProps> = ({ theme, onLogout, onProfilePress }) => {
  const rawMemberId = 'HD-2043';
  const numericMemberId = rawMemberId.replace(/\D/g, '');
  const formattedMemberId = numericMemberId.slice(-4).padStart(4, '0');

  const handlePress = (item: MoreItem) => {
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
      contentContainerStyle={styles.moreScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={[styles.profileAvatar, { backgroundColor: theme.accent }]}>
          <Text style={styles.profileInitials}>JD</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.textPrimary }]}>
            John Doe
          </Text>
          <Text style={[styles.profileMeta, { color: theme.textSecondary }]}>
            Patient id : #{formattedMemberId}
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

      {moreSections.map(section => (
        <View
          key={section.title}
          style={[styles.moreSection, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            {section.title}
          </Text>
          {section.items.map(item => (
            <TouchableOpacity
              key={item.key}
              style={styles.moreRow}
              onPress={() => handlePress(item)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.moreIconWrap,
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
              <View style={styles.moreCopy}>
                <Text
                  style={[styles.moreTitle, { color: theme.textPrimary }]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[styles.moreSubtitle, { color: theme.textSecondary }]}
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
        return <CalendarScreen theme={theme} />;
      case 'labs':
        return <LabsScreen theme={theme} />;
      case 'more':
        return (
          <MoreTab
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
              <Icon
                name={tab.icon}
                size={20}
                color={isActive ? theme.accent : theme.textSecondary}
                style={styles.tabIcon}
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
              {isActive && (
                <View
                  style={[styles.tabIndicator, { backgroundColor: theme.accent }]}
                />
              )}
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
  moreScroll: {
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
  moreSection: {
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
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 12,
  },
  moreIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreCopy: {
    flex: 1,
    gap: 2,
  },
  moreTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  moreSubtitle: {
    fontSize: 13,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 12,
  },
  tabIndicator: {
    marginTop: 4,
    height: 4,
    width: 24,
    borderRadius: 999,
  },
});

export default PatientTabs;
