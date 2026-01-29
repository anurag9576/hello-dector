import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Doctor } from '../../../data/doctors';
import { ThemePalette } from '../../../theme/palette';

type DoctorCardProps = {
  doctor: Doctor;
  theme: ThemePalette;
  onBook?: (doctor: Doctor) => void;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, theme, onBook }) => {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.textPrimary }]}>
          {doctor.name}
        </Text>
        <Text style={[styles.specialty, { color: theme.textSecondary }]}>
          {doctor.specialty}
        </Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {doctor.experience} · ⭐ {doctor.rating}
        </Text>
        
        <View style={styles.extraInfo}>
          {doctor.city && (
            <View style={styles.iconRow}>
              <Icon name="map-marker" size={14} color={theme.textSecondary} />
              <Text style={[styles.extraText, { color: theme.textSecondary }]}>{doctor.city}</Text>
            </View>
          )}
          {doctor.phone && (
            <View style={styles.iconRow}>
              <Icon name="phone" size={14} color={theme.textSecondary} />
              <Text style={[styles.extraText, { color: theme.textSecondary }]}>{doctor.phone}</Text>
            </View>
          )}
        </View>

        <Text style={[styles.availability, { color: theme.accent }]}>
          {doctor.availability}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent }]}
        onPress={() => onBook?.(doctor)}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginRight: 16,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  specialty: {
    fontSize: 15,
    fontWeight: '600',
  },
  extraInfo: {
    marginVertical: 4,
    gap: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  extraText: {
    fontSize: 12,
    fontWeight: '500',
  },
  meta: {
    fontSize: 13,
  },
  availability: {
    fontSize: 13,
    fontWeight: '600',
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

export default DoctorCard;