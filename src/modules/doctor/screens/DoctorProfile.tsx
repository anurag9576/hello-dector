import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';

type DoctorProfileProps = {
  theme: ThemePalette;
  onLogout: () => void;
};

type ProfileSectionItem = {
  label: string;
  icon: string;
  value?: string;
  type?: 'link' | 'toggle';
  color?: string;
  onPress?: () => void;
};

const DoctorProfile: React.FC<DoctorProfileProps> = ({ theme, onLogout }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: onLogout },
    ]);
  };

  const menuItems: { title: string; items: ProfileSectionItem[] }[] = [
    {
      title: 'Practice Management',
      items: [
        { label: 'Manage Schedule', icon: 'calendar-clock', type: 'link', color: '#3B82F6' },
        { label: 'Clinic Details', icon: 'hospital-building', value: 'HelloDoctor Clinic, Pune', type: 'link', color: '#10B981' },
        { label: 'Consultation Fees', icon: 'cash', value: '₹500 - ₹1500', type: 'link', color: '#F59E0B' },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { label: 'Accepting New Patients', icon: 'account-check', type: 'toggle', color: theme.accent },
        { label: 'Notifications', icon: 'bell-outline', type: 'toggle', color: theme.textSecondary },
        { label: 'Documents & License', icon: 'file-certificate-outline', type: 'link', color: theme.textSecondary },
        { label: 'Bank Details', icon: 'bank-outline', type: 'link', color: theme.textSecondary },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help & Support', icon: 'lifebuoy', type: 'link', color: theme.textSecondary },
        { label: 'Terms & Privacy', icon: 'shield-check-outline', type: 'link', color: theme.textSecondary },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView 
          contentContainerStyle={styles.container} 
          showsVerticalScrollIndicator={false}
      >
      {/* Profile Header */}
      <View style={[styles.headerCard, { backgroundColor: theme.card }]}>
        <View style={styles.avatarContainer}>
           <Image
              source={require('../../../screens/image/logo.png')} // Fallback avatar
              style={styles.avatar}
           />
           <View style={styles.verifiedBadge}>
              <Icon name="check-decagram" size={20} color="#3B82F6" />
           </View>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>Dr. Aditi Rao</Text>
          <Text style={[styles.specialty, { color: theme.accent }]}>Senior Cardiologist</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>MBBS, MD • 12 Years Exp.</Text>
        </View>

        <View style={styles.statsRow}>
           <View style={styles.statItem}>
             <Text style={[styles.statValue, { color: theme.textPrimary }]}>12k+</Text>
             <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Patients</Text>
           </View>
           <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
           <View style={styles.statItem}>
             <Text style={[styles.statValue, { color: theme.textPrimary }]}>4.9</Text>
             <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
           </View>
           <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
           <View style={styles.statItem}>
             <Text style={[styles.statValue, { color: theme.textPrimary }]}>2.5k</Text>
             <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
           </View>
        </View>
      </View>

      {/* Hero Action Card */}
      <View style={[styles.heroAction, { backgroundColor: theme.hero }]}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Boost Your Reach</Text>
            <Text style={styles.heroSubtitle}>Get promoted to top search results for 7 days.</Text>
          </View>
          <TouchableOpacity style={[styles.heroBtn, { backgroundColor: '#FFF' }]}>
             <Text style={[styles.heroBtnText, { color: theme.hero }]}>Promote</Text>
          </TouchableOpacity>
      </View>

      {/* Menu Sections */}
      {menuItems.map((section, index) => (
        <View key={index} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{section.title}</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.menuItem, 
                  idx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
                ]}
                onPress={item.type === 'link' ? item.onPress : undefined}
                activeOpacity={item.type === 'link' ? 0.7 : 1}
              >
                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                  <Icon name={item.icon} size={22} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                  {item.value && <Text style={[styles.menuValue, { color: theme.textSecondary }]}>{item.value}</Text>}
                </View>
                
                {item.type === 'toggle' ? (
                   <Switch
                      value={item.label === 'Accepting New Patients' ? isOnline : notificationsEnabled}
                      onValueChange={(val) => item.label === 'Accepting New Patients' ? setIsOnline(val) : setNotificationsEnabled(val)}
                      trackColor={{ false: theme.border, true: theme.accent }}
                      thumbColor="#FFF"
                   />
                ) : (
                   <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity 
         style={[styles.logoutBtn, { borderColor: theme.danger }]} 
         onPress={handleLogout}
      >
        <Icon name="logout" size={20} color={theme.danger} />
        <Text style={[styles.logoutText, { color: theme.danger }]}>Log Out</Text>
      </TouchableOpacity>

      <Text style={[styles.versionText, { color: theme.textSecondary }]}>Version 1.0.5 • HelloDoctor Partner</Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#F8FAFC',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  specialty: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  meta: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  heroAction: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroContent: {
    flex: 1,
    paddingRight: 16,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
  },
  heroBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  heroBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  sectionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuValue: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 20,
  },
});

export default DoctorProfile;
