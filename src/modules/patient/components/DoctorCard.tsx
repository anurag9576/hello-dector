import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Doctor } from '../../../data/doctors';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';

type DoctorCardProps = {
  doctor: Doctor;
  theme: ThemePalette;
  onBook?: (doctor: Doctor) => void;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, theme, onBook }) => {
  const { mode } = useThemeContext();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  // Generate initials from doctor name
  const getInitials = (name: string) => {
    const parts = name.replace(/^Dr\.?\s*/i, '').trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  // Generate a deterministic color for the avatar based on doctor name
  const getAvatarColor = (name: string) => {
    const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#D63031', '#00CEC9', '#E84393'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getAvatarColor(doctor.name);
  const initials = getInitials(doctor.name);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Accent stripe */}
        <View style={[styles.accentStripe, { backgroundColor: avatarColor }]} />

        <View style={styles.cardBody}>
          {/* Info */}
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.textPrimary }]} numberOfLines={1}>
              {doctor.name}
            </Text>
            <Text style={[styles.specialty, { color: theme.accent }]} numberOfLines={1}>
              {doctor.specialty}
            </Text>
            
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Icon name="clock-outline" size={13} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{doctor.experience}</Text>
              </View>
              <View style={styles.metaChip}>
                <Icon name="star" size={13} color="#FBBF24" />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>{doctor.rating}</Text>
              </View>
            </View>

            <View style={styles.extraInfo}>
              {doctor.city && (
                <View style={styles.iconRow}>
                  <Icon name="map-marker-outline" size={13} color={theme.textSecondary} />
                  <Text style={[styles.extraText, { color: theme.textSecondary }]}>{doctor.city}</Text>
                </View>
              )}
              {doctor.phone && (
                <View style={styles.iconRow}>
                  <Icon name="phone-outline" size={13} color={theme.textSecondary} />
                  <Text style={[styles.extraText, { color: theme.textSecondary }]}>{doctor.phone}</Text>
                </View>
              )}
            </View>

            <View style={styles.availabilityRow}>
              <View style={[styles.availabilityDot, { backgroundColor: theme.success }]} />
              <Text style={[styles.availability, { color: theme.success }]}>
                {doctor.availability}
              </Text>
            </View>
          </View>

          {/* Book Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }]}
            onPress={() => onBook?.(doctor)}
          >
            <Icon name="calendar-check" size={16} color="#fff" />
            <Text style={styles.buttonText}>Book</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  accentStripe: {
    height: 4,
    width: '100%',
  },
  cardBody: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  specialty: {
    fontSize: 13,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  extraInfo: {
    marginTop: 4,
    gap: 3,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  extraText: {
    fontSize: 11,
    fontWeight: '500',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  availabilityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  availability: {
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#fff',
    letterSpacing: 0.3,
  },
});

export default DoctorCard;