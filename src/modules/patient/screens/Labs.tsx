import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';
import { labs } from '../data';
import Icon from 'react-native-vector-icons/AntDesign';

type LabsScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
};

const LabsScreen: React.FC<LabsScreenProps> = ({ theme, onBack }) => {
  const { mode } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.navbar, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onBack}
            activeOpacity={0.7}
            disabled={!onBack}
          >
            <Icon name="arrowleft" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
            Results
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
        showsVerticalScrollIndicator={false}
      >
      {labs.map(lab => (
        <View
          key={lab.title}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {lab.title}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Last updated {lab.date}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  lab.status === 'Delivered' 
                    ? (mode === 'dark' ? theme.softAccent : '#DCFCE7')
                    : (mode === 'dark' ? theme.softAccent : '#E5F4FF'),
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { 
                  color: lab.status === 'Delivered' 
                    ? (mode === 'dark' ? theme.success : '#15803D')
                    : (mode === 'dark' ? theme.accent : '#1E40AF')
                },
              ]}
            >
              {lab.status}
            </Text>
          </View>
        </View>
      ))}
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
    paddingVertical: 18,
    borderBottomWidth: 1,
    paddingTop: 25,
    justifyContent: 'space-between',
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  info: {
    flex: 1,
    marginRight: 12,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
});

export default LabsScreen;
