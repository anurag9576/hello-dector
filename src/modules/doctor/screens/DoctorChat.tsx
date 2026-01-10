import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';

type PatientChat = {
  id: string;
  name: string;
  condition: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  initials: string;
  avatarColor: string;
};

type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean; // true if it's ME (the Doctor), false if it's the Patient
  timestamp: Date;
  sender?: string;
};

type DoctorChatProps = {
  theme: ThemePalette;
  onBack?: () => void;
};

const DoctorChat: React.FC<DoctorChatProps> = ({ theme, onBack }) => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const patients: PatientChat[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      condition: 'Migraine Follow-up',
      lastMessage: 'The medicine is working better now, thanks!',
      lastMessageTime: '10:30 AM',
      unreadCount: 1,
      isOnline: true,
      initials: 'RS',
      avatarColor: '#3B82F6',
    },
    {
      id: '2',
      name: 'Priya Verma',
      condition: 'Hypertension',
      lastMessage: 'My BP reading this morning was 130/85.',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      initials: 'PV',
      avatarColor: '#EF4444',
    },
    {
      id: '3',
      name: 'Amit Singh',
      condition: 'Post-Op Recovery',
      lastMessage: 'Can I start light walking exercises?',
      lastMessageTime: 'Monday',
      unreadCount: 3,
      isOnline: true,
      initials: 'AS',
      avatarColor: '#F59E0B',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Good morning, Dr. Rao. I have a question about my dosage.',
      isUser: false, // Patient
      timestamp: new Date(Date.now() - 3600000),
      sender: 'Rahul Sharma',
    },
    {
      id: '2',
      text: 'Hello Rahul. Sure, what would you like to know?',
      isUser: true, // Me (Doctor)
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: '3',
      text: 'Should I take the second pill before or after dinner?',
      isUser: false,
      timestamp: new Date(Date.now() - 2400000),
      sender: 'Rahul Sharma',
    },
    {
      id: '4',
      text: 'Take it after dinner to avoid acidity.',
      isUser: true,
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: '5',
      text: 'The medicine is working better now, thanks!',
      isUser: false,
      timestamp: new Date(Date.now() - 60000),
      sender: 'Rahul Sharma',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
    }
  };

  const renderPatientItem = ({ item }: { item: PatientChat }) => (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => setSelectedPatient(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.avatarBox, { backgroundColor: item.avatarColor + '20' }]}>
        <Text style={[styles.avatarText, { color: item.avatarColor }]}>{item.initials}</Text>
        {item.isOnline && <View style={[styles.onlineDot, { backgroundColor: theme.success }]} />}
      </View>
      <View style={styles.infoBox}>
        <View style={styles.topRow}>
          <Text style={[styles.nameText, { color: theme.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.timeText, { color: theme.textSecondary }]}>{item.lastMessageTime}</Text>
        </View>
        <Text style={[styles.conditionText, { color: theme.accent }]}>{item.condition}</Text>
        <Text style={[styles.msgPreview, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: theme.hero }]}>
          <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.msgBubbleContainer, 
      item.isUser ? styles.msgRight : styles.msgLeft
    ]}>
      <View style={[
        styles.msgBubble, 
        { 
          backgroundColor: item.isUser ? theme.hero : theme.card,
          borderBottomRightRadius: item.isUser ? 4 : 20,
          borderBottomLeftRadius: item.isUser ? 20 : 4,
          elevation: 1,
        }
      ]}>
        <Text style={[
          styles.msgText, 
          { color: item.isUser ? '#FFF' : theme.textPrimary }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.msgTime, 
          { color: item.isUser ? 'rgba(255,255,255,0.7)' : theme.textSecondary }
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  if (!selectedPatient) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Patient Messages</Text>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.background }]}>
             <Icon name="magnify" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
         <TouchableOpacity onPress={() => setSelectedPatient(null)} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={theme.textPrimary} />
         </TouchableOpacity>
         <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatName, { color: theme.textPrimary }]}>{selectedPatientData?.name}</Text>
            <Text style={[styles.chatStatus, { color: theme.textSecondary }]}>
               {selectedPatientData?.condition}
            </Text>
         </View>
         <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.background }]}>
            <Icon name="video" size={22} color={theme.hero} />
         </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContent}
      />

      {/* Input Area */}
      <View style={[styles.inputArea, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
         <TouchableOpacity style={styles.attachBtn}>
            <Icon name="plus" size={24} color={theme.textSecondary} />
         </TouchableOpacity>
         <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.textPrimary }]}
            placeholder="Type a message..."
            placeholderTextColor={theme.textSecondary}
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
         />
         <TouchableOpacity 
            style={[styles.sendBtn, { backgroundColor: inputMessage.trim() ? theme.hero : theme.border }]}
            onPress={sendMessage}
            disabled={!inputMessage.trim()}
         >
            <Icon name="send" size={20} color="#FFF" />
         </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 12,
  },
  listContent: {
    padding: 16,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#FFF', // fallback
    gap: 16,
    elevation: 1,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoBox: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  msgPreview: {
    fontSize: 14,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
  },
  chatStatus: {
    fontSize: 13,
  },
  chatContent: {
    padding: 20,
    gap: 16,
  },
  msgBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  msgLeft: {
    justifyContent: 'flex-start',
  },
  msgRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  msgText: {
    fontSize: 16,
    lineHeight: 22,
  },
  msgTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  attachBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoctorChat;
