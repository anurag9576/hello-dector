import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';
import { sessions } from '../data';

type CalendarScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
  onBookNew?: () => void;
};

type Session = {
  date: string;
  time: string;
  title: string;
  doctor: string;
  notes?: string;
  location?: string;
  preparation?: string[];
};

type EditingSession = {
  session: Session;
  newDate: Date;
  newTime: string;
  newTitle: string;
  newDoctor: string;
  newNotes: string;
};

// Deterministic color from doctor name
const getDoctorColor = (name: string) => {
  const colors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#D63031', '#00CEC9', '#E84393', '#FDCB6E'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  const parts = name.replace(/^Dr\.?\s*/i, '').trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

const CalendarScreen: React.FC<CalendarScreenProps> = ({ theme, onBack, onBookNew }) => {
  const { mode } = useThemeContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<EditingSession | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [sessionsData, setSessionsData] = useState<Session[]>(
    sessions.map(s => ({
      ...s,
      notes: '',
      location: 'HelloDoctor Clinic, Pune',
      preparation: ['Bring ID proof', 'Fast 8 hours before test']
    }))
  );

  const getDayName = (dateStr: string) => {
    const [month, day] = dateStr.split(' ');
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const date = new Date(2025, monthMap[month] || 0, parseInt(day));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4);
  };

  const handleEditPress = (session: Session) => {
    const [month, day] = session.date.split(' ');
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    const date = new Date(2025, monthMap[month] || 0, parseInt(day));

    setEditingSession({
      session,
      newDate: date,
      newTime: session.time,
      newTitle: session.title,
      newDoctor: session.doctor,
      newNotes: session.notes || ''
    });
    setExpandedCard(`${session.date}-${session.time}`);
  };

  const handleSaveEdit = () => {
    if (!editingSession) return;

    setSessionsData(prev => prev.map(session =>
      session.date === editingSession.session.date &&
      session.time === editingSession.session.time
        ? {
            ...session,
            date: editingSession.newDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: editingSession.newTime,
            title: editingSession.newTitle,
            doctor: editingSession.newDoctor,
            notes: editingSession.newNotes
          }
        : session
    ));

    setEditingSession(null);
    setExpandedCard(null);
    Alert.alert('Success', 'Appointment updated successfully!');
  };

  const handleCancelAppointment = (session: Session) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setSessionsData(prev => prev.filter(s =>
              !(s.date === session.date && s.time === session.time)
            ));
            setExpandedCard(null);
            Alert.alert('Cancelled', 'Appointment has been cancelled.');
          }
        }
      ]
    );
  };

  const handleShareAppointment = async (session: Session) => {
    const message = `Appointment Details:\nDate: ${session.date}\nTime: ${session.time}\nType: ${session.title}\nDoctor: ${session.doctor}\nLocation: ${session.location}`;
    try {
      await Share.share({ message, title: 'Appointment Details' });
    } catch (error) {
      Alert.alert('Error', 'Could not share appointment details');
    }
  };

  const handleAddToCalendar = (session: Session) => {
    Alert.alert(
      'Add to Calendar',
      'This feature would integrate with your device calendar to add the appointment.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const toggleExpand = (cardKey: string) => {
    if (editingSession) return;
    setExpandedCard(prev => (prev === cardKey ? null : cardKey));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ── Navbar ── */}
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderBottomWidth: isScrolled ? StyleSheet.hairlineWidth : 0,
            shadowOpacity: isScrolled ? 0.06 : 0,
            elevation: isScrolled ? 4 : 0,
          },
        ]}
      >
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
            Appointments
          </Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: theme.accent + '15' }]}>
          <Text style={[styles.countText, { color: theme.accent }]}>{sessionsData.length}</Text>
        </View>
      </View>

      {/* ── Cards ── */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {sessionsData.map(session => {
          const cardKey = `${session.date}-${session.time}`;
          const isExpanded = expandedCard === cardKey;
          const isEditing = editingSession?.session.date === session.date &&
                           editingSession?.session.time === session.time;
          const docColor = getDoctorColor(session.doctor);
          const docInitials = getInitials(session.doctor);
          const dateParts = session.date.split(' ');

          return (
            <TouchableOpacity
              key={cardKey}
              activeOpacity={0.95}
              onPress={() => toggleExpand(cardKey)}
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.card,
                    borderColor: isExpanded
                      ? theme.accent
                      : mode === 'dark'
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.04)',
                    borderWidth: isExpanded ? 1.5 : 1,
                  },
                ]}
              >
                {/* Top accent stripe */}
                <View style={[styles.cardStripe, { backgroundColor: docColor }]} />

                <View style={styles.cardBody}>
                  {/* Left: Date badge */}
                  <View style={[styles.dateBadge, { backgroundColor: docColor + '12' }]}>
                    <Text style={[styles.dateDay, { color: docColor }]}>{dateParts[1] || ''}</Text>
                    <Text style={[styles.dateMonth, { color: docColor }]}>{dateParts[0] || ''}</Text>
                    <View style={[styles.dayChip, { backgroundColor: docColor + '18' }]}>
                      <Text style={[styles.dayChipText, { color: docColor }]}>
                        {getDayName(session.date)}
                      </Text>
                    </View>
                  </View>

                  {/* Center: Info */}
                  <View style={styles.infoBlock}>
                    {isEditing ? (
                      <TextInput
                        style={[styles.titleInput, { color: theme.textPrimary, borderColor: theme.border }]}
                        value={editingSession.newTitle}
                        onChangeText={(text) => setEditingSession(prev => prev ? {...prev, newTitle: text} : null)}
                        placeholder="Appointment type"
                      />
                    ) : (
                      <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
                        {session.title}
                      </Text>
                    )}

                    {isEditing ? (
                      <TextInput
                        style={[styles.doctorInput, { color: theme.textPrimary, borderColor: theme.border }]}
                        value={editingSession.newDoctor}
                        onChangeText={(text) => setEditingSession(prev => prev ? {...prev, newDoctor: text} : null)}
                        placeholder="Doctor name"
                      />
                    ) : (
                      <View style={styles.doctorRow}>
                        <View style={[styles.doctorAvatar, { backgroundColor: docColor + '20' }]}>
                          <Text style={[styles.doctorAvatarText, { color: docColor }]}>{docInitials}</Text>
                        </View>
                        <Text style={[styles.doctor, { color: theme.textSecondary }]} numberOfLines={1}>
                          {session.doctor}
                        </Text>
                      </View>
                    )}

                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <Icon name="clock-outline" size={13} color={theme.textSecondary} />
                        <Text style={[styles.metaText, { color: theme.textSecondary }]}>{session.time}</Text>
                      </View>
                      {session.notes && !isEditing && (
                        <View style={styles.metaChip}>
                          <Icon name="note-text-outline" size={13} color={theme.textSecondary} />
                          <Text style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>Note</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Right: Edit button */}
                  <TouchableOpacity
                    style={[
                      styles.editBtn,
                      {
                        backgroundColor: isEditing ? theme.accent : theme.accent + '12',
                      },
                    ]}
                    onPress={() => isEditing ? handleSaveEdit() : handleEditPress(session)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={isEditing ? 'check' : 'pencil-outline'}
                      size={18}
                      color={isEditing ? '#fff' : theme.accent}
                    />
                  </TouchableOpacity>
                </View>

                {/* ── Expanded section ── */}
                {isExpanded && (
                  <View style={[styles.expandedContent, { borderTopColor: theme.border }]}>
                    {isEditing ? (
                      <View style={styles.editSection}>
                        <View style={styles.editFieldRow}>
                          <View style={[styles.editIconWrap, { backgroundColor: theme.accent + '12' }]}>
                            <Icon name="calendar" size={16} color={theme.accent} />
                          </View>
                          <TouchableOpacity
                            style={[styles.editValue, { backgroundColor: theme.background, borderColor: theme.border }]}
                            onPress={() => setShowDatePicker(true)}
                          >
                            <Text style={{ color: theme.textPrimary, fontSize: 14 }}>
                              {editingSession.newDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                            <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.editFieldRow}>
                          <View style={[styles.editIconWrap, { backgroundColor: theme.accent + '12' }]}>
                            <Icon name="clock-outline" size={16} color={theme.accent} />
                          </View>
                          <TouchableOpacity
                            style={[styles.editValue, { backgroundColor: theme.background, borderColor: theme.border }]}
                            onPress={() => setShowTimePicker(true)}
                          >
                            <Text style={{ color: theme.textPrimary, fontSize: 14 }}>{editingSession.newTime}</Text>
                            <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                          </TouchableOpacity>
                        </View>

                        <TextInput
                          style={[styles.notesInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
                          value={editingSession.newNotes}
                          onChangeText={(text) => setEditingSession(prev => prev ? {...prev, newNotes: text} : null)}
                          placeholder="Add notes..."
                          placeholderTextColor={theme.textSecondary}
                          multiline
                          numberOfLines={3}
                        />

                        <TouchableOpacity
                          style={[styles.cancelEditBtn, { borderColor: theme.border }]}
                          onPress={() => { setEditingSession(null); setExpandedCard(null); }}
                        >
                          <Text style={[styles.cancelEditText, { color: theme.textSecondary }]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.expandedInfo}>
                        <View style={styles.expandedRow}>
                          <View style={[styles.expandedIconWrap, { backgroundColor: theme.accent + '12' }]}>
                            <Icon name="map-marker-outline" size={16} color={theme.accent} />
                          </View>
                          <Text style={[styles.expandedText, { color: theme.textSecondary }]}>
                            {session.location}
                          </Text>
                        </View>

                        {session.preparation && session.preparation.length > 0 && (
                          <View style={styles.prepSection}>
                            <Text style={[styles.prepTitle, { color: theme.textPrimary }]}>Preparation</Text>
                            {session.preparation.map((prep, index) => (
                              <View key={index} style={styles.prepItem}>
                                <Icon name="check-circle-outline" size={15} color={theme.success} />
                                <Text style={[styles.prepText, { color: theme.textSecondary }]}>{prep}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.accent + '10', borderColor: theme.accent + '20' }]}
                            onPress={() => handleShareAppointment(session)}
                          >
                            <Icon name="share-variant-outline" size={16} color={theme.accent} />
                            <Text style={[styles.actionBtnText, { color: theme.accent }]}>Share</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: theme.accent + '10', borderColor: theme.accent + '20' }]}
                            onPress={() => handleAddToCalendar(session)}
                          >
                            <Icon name="calendar-plus" size={16} color={theme.accent} />
                            <Text style={[styles.actionBtnText, { color: theme.accent }]}>Calendar</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: 'rgba(211,47,47,0.08)', borderColor: 'rgba(211,47,47,0.15)' }]}
                            onPress={() => handleCancelAppointment(session)}
                          >
                            <Icon name="close-circle-outline" size={16} color="#d32f2f" />
                            <Text style={[styles.actionBtnText, { color: '#d32f2f' }]}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {sessionsData.length === 0 && (
          <View style={[styles.emptyState, { borderColor: theme.border }]}>
            <Icon name="calendar-blank-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No appointments</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Book a doctor to get started</Text>
          </View>
        )}

        {showDatePicker && editingSession && (
          <DateTimePicker
            value={editingSession.newDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setEditingSession(prev => prev ? {...prev, newDate: selectedDate} : null);
              }
            }}
          />
        )}

        {showTimePicker && editingSession && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                const time = selectedTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                });
                setEditingSession(prev => prev ? {...prev, newTime: time} : null);
              }
            }}
          />
        )}
      </ScrollView>

      {/* FAB for New Appointment */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.accent }]} 
        onPress={onBookNew}
        activeOpacity={0.8}
      >
        <Icon name="calendar-plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  // ── Navbar ──
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    zIndex: 10,
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
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  countBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
  },
  countText: {
    fontSize: 14,
    fontWeight: '800',
  },
  // ── Scroll ──
  scrollArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 14,
  },
  // ── Card ──
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardStripe: {
    height: 4,
    width: '100%',
  },
  cardBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  // ── Date badge ──
  dateBadge: {
    width: 62,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    gap: 2,
  },
  dateDay: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  dayChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  // ── Info ──
  infoBlock: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  doctorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorAvatarText: {
    fontSize: 10,
    fontWeight: '800',
  },
  doctor: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 3,
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
  // ── Edit button ──
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── Inputs ──
  titleInput: {
    fontSize: 15,
    fontWeight: '700',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  doctorInput: {
    fontSize: 13,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  // ── Expanded ──
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 14,
  },
  expandedInfo: {
    gap: 14,
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expandedIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  prepSection: {
    gap: 8,
  },
  prepTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  prepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  prepText: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // ── Edit section ──
  editSection: {
    gap: 14,
  },
  editFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editValue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  notesInput: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  cancelEditBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: 'flex-end',
  },
  cancelEditText: {
    fontWeight: '600',
    fontSize: 13,
  },
  // ── Notes ──
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  // ── Empty state ──
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    gap: 10,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default CalendarScreen;
