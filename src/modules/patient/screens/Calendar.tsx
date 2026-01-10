import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Share,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemePalette } from '../../../theme/palette';
import { sessions } from '../data';

type CalendarScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
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

const CalendarScreen: React.FC<CalendarScreenProps> = ({ theme, onBack }) => {
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
      await Share.share({
        message,
        title: 'Appointment Details'
      });
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
        {sessionsData.map(session => {
          const cardKey = `${session.date}-${session.time}`;
          const isExpanded = expandedCard === cardKey;
          const isEditing = editingSession?.session.date === session.date && 
                           editingSession?.session.time === session.time;
          
          return (
            <View key={cardKey}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.card,
                    borderColor: isExpanded ? theme.accent : theme.border,
                    borderWidth: isExpanded ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.dateBlock}>
                  <Text style={[styles.dateText, { color: theme.textPrimary }]}>
                    {session.date}
                  </Text>
                  <Text style={[styles.dayName, { color: theme.accent }]}>
                    {getDayName(session.date)}
                  </Text>
                  <Text style={[styles.timeText, { color: theme.textSecondary }]}>
                    {session.time}
                  </Text>
                </View>
                
                <View style={styles.details}>
                  {isEditing ? (
                    <TextInput
                      style={[styles.titleInput, { color: theme.textPrimary, borderColor: theme.border }]}
                      value={editingSession.newTitle}
                      onChangeText={(text) => setEditingSession(prev => prev ? {...prev, newTitle: text} : null)}
                      placeholder="Appointment type"
                    />
                  ) : (
                    <Text style={[styles.title, { color: theme.textPrimary }]}>
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
                    <Text style={[styles.doctor, { color: theme.textSecondary }]}>
                      with {session.doctor}
                    </Text>
                  )}
                  
                  {session.notes && !isEditing && (
                    <Text style={[styles.notes, { color: theme.textSecondary }]}>
                      📝 {session.notes}
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isEditing ? theme.accent : theme.softAccent }]}
                  onPress={() => isEditing ? handleSaveEdit() : handleEditPress(session)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.buttonText, { color: isEditing ? '#fff' : theme.hero }]}>
                    {isEditing ? 'Save' : 'Edit'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {isExpanded && (
                <View style={[styles.expandedContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  {isEditing ? (
                    <View style={styles.editSection}>
                      <View style={styles.editRow}>
                        <Text style={[styles.editLabel, { color: theme.textSecondary }]}>Date:</Text>
                        <TouchableOpacity
                          style={[styles.editValue, { backgroundColor: theme.background, borderColor: theme.border }]}
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text style={{ color: theme.textPrimary }}>
                            {editingSession.newDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Text>
                          <Icon name="calendar" size={16} color={theme.accent} />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.editRow}>
                        <Text style={[styles.editLabel, { color: theme.textSecondary }]}>Time:</Text>
                        <TouchableOpacity
                          style={[styles.editValue, { backgroundColor: theme.background, borderColor: theme.border }]}
                          onPress={() => setShowTimePicker(true)}
                        >
                          <Text style={{ color: theme.textPrimary }}>{editingSession.newTime}</Text>
                          <Icon name="clock" size={16} color={theme.accent} />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.editRow}>
                        <Text style={[styles.editLabel, { color: theme.textSecondary }]}>Notes:</Text>
                        <TextInput
                          style={[styles.notesInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]}
                          value={editingSession.newNotes}
                          onChangeText={(text) => setEditingSession(prev => prev ? {...prev, newNotes: text} : null)}
                          placeholder="Add notes about this appointment..."
                          multiline
                          numberOfLines={3}
                        />
                      </View>
                      
                      <View style={styles.editActions}>
                        <TouchableOpacity
                          style={[styles.cancelEditBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
                          onPress={() => {
                            setEditingSession(null);
                            setExpandedCard(null);
                          }}
                        >
                          <Text style={[styles.cancelEditText, { color: theme.textSecondary }]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.actionSection}>
                      <View style={styles.infoRow}>
                        <Icon name="map-marker" size={16} color={theme.accent} />
                        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                          {session.location}
                        </Text>
                      </View>
                      
                      {session.preparation && session.preparation.length > 0 && (
                        <View style={styles.prepSection}>
                          <Text style={[styles.prepTitle, { color: theme.textPrimary }]}>Preparation:</Text>
                          {session.preparation.map((prep, index) => (
                            <View key={index} style={styles.prepItem}>
                              <Icon name="check-circle" size={14} color={theme.accent} />
                              <Text style={[styles.prepText, { color: theme.textSecondary }]}>{prep}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
                          onPress={() => handleShareAppointment(session)}
                        >
                          <Icon name="share" size={18} color={theme.textSecondary} />
                          <Text style={[styles.actionBtnText, { color: theme.textSecondary }]}>Share</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
                          onPress={() => handleAddToCalendar(session)}
                        >
                          <Icon name="calendar-plus" size={18} color={theme.textSecondary} />
                          <Text style={[styles.actionBtnText, { color: theme.textSecondary }]}>Add to Calendar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: '#ffebee', borderColor: '#ffcdd2' }]}
                          onPress={() => handleCancelAppointment(session)}
                        >
                          <Icon name="close-circle" size={18} color="#d32f2f" />
                          <Text style={[styles.actionBtnText, { color: '#d32f2f' }]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
        
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
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  timeText: {
    fontSize: 13,
    marginTop: 2,
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
  // Expanded card styles
  expandedContent: {
    marginTop: -1,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 16,
  },
  editSection: {
    gap: 16,
  },
  editRow: {
    gap: 12,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 60,
  },
  editValue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '700',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  doctorInput: {
    fontSize: 13,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  notesInput: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelEditBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelEditText: {
    fontWeight: '600',
  },
  actionSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  prepSection: {
    gap: 8,
  },
  prepTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  prepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prepText: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default CalendarScreen;
