import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemePalette } from '../../../theme/palette';

type ProfileProps = {
  theme: ThemePalette;
};

const Profile: React.FC<ProfileProps> = ({ theme }) => {
  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Profile</Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          Patient preferences & account coming soon.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Profile;
