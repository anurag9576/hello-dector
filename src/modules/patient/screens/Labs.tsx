import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';
import { labs } from '../data';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LabsScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
};

const statusConfig: Record<string, { icon: string; color: string; bg: string; darkBg: string }> = {
  'Delivered': { icon: 'check-circle', color: '#15803D', bg: '#DCFCE7', darkBg: 'rgba(22,163,74,0.15)' },
  'In progress': { icon: 'progress-clock', color: '#1E40AF', bg: '#DBEAFE', darkBg: 'rgba(30,64,175,0.15)' },
  'Pending sample': { icon: 'clock-outline', color: '#D97706', bg: '#FEF3C7', darkBg: 'rgba(217,119,6,0.15)' },
};

const LabsScreen: React.FC<LabsScreenProps> = ({ theme, onBack }) => {
  const { mode } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.navbar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
            onPress={onBack}
            activeOpacity={0.7}
            disabled={!onBack}
          >
            <Icon name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
            Lab Results
          </Text>
        </View>
        <View style={[styles.navBadge, { backgroundColor: theme.accent + '18' }]}>
          <Text style={[styles.navBadgeText, { color: theme.accent }]}>{labs.length}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
      >
      {labs.map(lab => {
        const config = statusConfig[lab.status] || statusConfig['Pending sample'];
        return (
          <View
            key={lab.title}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              },
            ]}
          >
            {/* Left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: config.color }]} />
            
            <View style={styles.cardBody}>
              <View style={[styles.iconCircle, { backgroundColor: mode === 'dark' ? config.darkBg : config.bg }]}>
                <Icon name="flask-outline" size={20} color={config.color} />
              </View>
              
              <View style={styles.info}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  {lab.title}
                </Text>
                <View style={styles.dateRow}>
                  <Icon name="calendar-outline" size={13} color={theme.textSecondary} />
                  <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {lab.date}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: mode === 'dark' ? config.darkBg : config.bg },
                ]}
              >
                <Icon name={config.icon} size={14} color={config.color} />
                <Text style={[styles.badgeText, { color: config.color }]}>
                  {lab.status}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingTop: 22,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  navBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  navBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  accentBar: {
    width: '100%',
    height: 3,
  },
  cardBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  badge: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 11,
  },
});

export default LabsScreen;
