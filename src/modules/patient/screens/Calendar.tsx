import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { sessions } from '../data';

type CalendarScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
};

const CalendarScreen: React.FC<CalendarScreenProps> = ({ theme, onBack }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: theme.card,
            shadowColor: '#000',
            borderColor: theme.border,
            borderBottomWidth: isScrolled ? StyleSheet.hairlineWidth : 0,
            shadowOpacity: isScrolled ? 0.08 : 0,
            elevation: isScrolled ? 3 : 0,
          },
        ]}
      >
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onBack}
            activeOpacity={0.7}
            disabled={!onBack}
          >
            <Icon name="arrow-left" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
            Exam
          </Text>
        </View>
        <View style={styles.navButtonPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    zIndex: 10,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
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
