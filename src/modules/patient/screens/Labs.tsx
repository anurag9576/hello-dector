import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemePalette } from '../../../theme/palette';
import { labs } from '../data';

type LabsScreenProps = {
  theme: ThemePalette;
};

const LabsScreen: React.FC<LabsScreenProps> = ({ theme }) => {
  return (
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
                  lab.status === 'Delivered' ? '#DCFCE7' : '#E5F4FF',
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: lab.status === 'Delivered' ? '#15803D' : '#1E40AF' },
              ]}
            >
              {lab.status}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
