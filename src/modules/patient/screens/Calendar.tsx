import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemePalette } from '../../../theme/palette';
import { sessions } from '../data';

type CalendarScreenProps = {
  theme: ThemePalette;
};

const CalendarScreen: React.FC<CalendarScreenProps> = ({ theme }) => {
  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
      showsVerticalScrollIndicator={false}
    >
      {sessions.map(session => (
        <View
          key={`${session.date}-${session.time}`}
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.dateBlock}>
            <Text style={[styles.dateText, { color: theme.textPrimary }]}>
              {session.date}
            </Text>
            <Text style={[styles.timeText, { color: theme.textSecondary }]}>
              {session.time}
            </Text>
          </View>
          <View style={styles.details}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {session.title}
            </Text>
            <Text style={[styles.doctor, { color: theme.textSecondary }]}>
              with {session.doctor}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.softAccent }]}
          >
            <Text style={[styles.buttonText, { color: theme.hero }]}>Edit</Text>
          </TouchableOpacity>
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
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 16,
  },
  dateBlock: {
    alignItems: 'center',
    width: 70,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 13,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  doctor: {
    fontSize: 13,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontWeight: '700',
  },
});

export default CalendarScreen;
