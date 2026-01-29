import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { patientMeta } from './user_profile_data';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  initials: string;
};

type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sender?: string;
};

type ChatProps = {
  theme: ThemePalette;
  onBack: () => void;
};

const Chat: React.FC<ChatProps> = ({ theme, onBack }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Raghav Mehta',
      specialty: 'Neurologist',
      lastMessage: 'Thank you for sharing that. Based on your symptoms...',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
      isOnline: true,
      initials: 'RM',
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      lastMessage: 'Your test results look good. Continue with...',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      initials: 'PS',
    },
    {
      id: '3',
      name: 'Dr. Amit Kumar',
      specialty: 'General Physician',
      lastMessage: 'Please take the medication as prescribed...',
      lastMessageTime: 'Monday',
      unreadCount: 1,
      isOnline: true,
      initials: 'AK',
    },
    {
      id: '4',
      name: 'Dr. Sneha Patel',
      specialty: 'Dermatologist',
      lastMessage: 'The rash should clear up in a few days...',
      lastMessageTime: 'Sunday',
      unreadCount: 0,
      isOnline: false,
      initials: 'SP',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m Dr. Raghav Mehta. How can I help you today?',
      isUser: false,
      timestamp: new Date(Date.now() - 3600000),
      sender: 'Dr. Raghav Mehta',
    },
    {
      id: '2',
      text: 'Good morning doctor. I\'ve been experiencing frequent headaches lately.',
      isUser: true,
      timestamp: new Date(Date.now() - 3000000),
    },
    {
      id: '3',
      text: 'I understand. Can you tell me more about your headaches? When did they start and how often do you get them?',
      isUser: false,
      timestamp: new Date(Date.now() - 2400000),
      sender: 'Dr. Raghav Mehta',
    },
    {
      id: '4',
      text: 'They started about 2 weeks ago. I get them almost daily, especially in the evenings.',
      isUser: true,
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const selectedDoctorData = doctors.find(doc => doc.id === selectedDoctor);

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
      setIsTyping(true);

      // Simulate doctor response
      setTimeout(() => {
        const doctorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for sharing that. Based on your symptoms, I recommend we schedule a consultation. Would you like to book an appointment?',
          isUser: false,
          timestamp: new Date(),
          sender: selectedDoctorData?.name || 'Doctor',
        };
        setMessages(prev => [...prev, doctorResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const suggestedQuestions = [
    'I need a prescription refill',
    'I have new symptoms to discuss',
    'I want to book an appointment',
    'I have questions about my test results',
  ];

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => setSelectedDoctor(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.doctorAvatar, { backgroundColor: theme.accent }]}>
        <Text style={styles.doctorInitials}>{item.initials}</Text>
        {item.isOnline && <View style={[styles.onlineDot, { backgroundColor: '#22C55E' }]} />}
      </View>
      <View style={styles.doctorInfo}>
        <View style={styles.doctorHeader}>
          <Text style={[styles.doctorName, { color: theme.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.doctorSpecialty, { color: theme.textSecondary }]}>
            {item.specialty}
          </Text>
        </View>
        <View style={styles.lastMessage}>
          <Text
            style={[styles.lastMessageText, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          <Text style={[styles.lastMessageTime, { color: theme.textSecondary }]}>
            {item.lastMessageTime}
          </Text>
        </View>
      </View>
      {item.unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: theme.accent }]}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={item.isUser ? styles.userMessageContainer : styles.doctorMessageContainer}>
      {!item.isUser && (
        <View style={styles.doctorInfo}>
          <View style={[styles.doctorAvatar, { backgroundColor: theme.accent }]}>
            <Text style={styles.doctorInitials}>
              {selectedDoctorData?.initials || 'DR'}
            </Text>
          </View>
          <Text style={[styles.doctorName, { color: theme.textSecondary }]}>
            {item.sender}
          </Text>
        </View>
      )}
      <View style={item.isUser ? styles.userMessage : styles.doctorMessage}>
        <Text style={[styles.messageText, { color: item.isUser ? '#fff' : theme.textPrimary }]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime, { color: item.isUser ? '#fff8' : theme.textSecondary }]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderSuggestedQuestion = (question: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.suggestedQuestion, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => {
        setInputMessage(question);
        setTimeout(() => sendMessage(), 100);
      }}
    >
      <Text style={[styles.suggestedQuestionText, { color: theme.textPrimary }]}>
        {question}
      </Text>
      <Icon name="send" size={16} color={theme.accent} />
    </TouchableOpacity>
  );

  // Doctor List View
  if (!selectedDoctor) {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.header, { backgroundColor: 'transparent', borderBottomColor: theme.border }]}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Icon name="arrow-left" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Chats
            </Text>
            <TouchableOpacity style={styles.newChatButton}>
              <Icon name="plus" size={24} color={theme.accent} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={doctors}
            renderItem={renderDoctorItem}
            keyExtractor={item => item.id}
            style={styles.doctorsList}
            contentContainerStyle={styles.doctorsListContent}
            keyboardShouldPersistTaps={false}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Chat View
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: 'transparent', borderBottomColor: theme.border }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedDoctor(null)}>
            <Icon name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              {selectedDoctorData?.name}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              {selectedDoctorData?.specialty} • {selectedDoctorData?.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <View style={[styles.onlineIndicator, { backgroundColor: selectedDoctorData?.isOnline ? '#22C55E' : theme.textSecondary }]} />
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={[styles.typingText, { color: theme.textSecondary }]}>
              Doctor is typing...
            </Text>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: theme.background, color: theme.textPrimary }]}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your message..."
            placeholderTextColor={theme.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: inputMessage.trim() ? theme.accent : theme.textSecondary }]}
            onPress={sendMessage}
            disabled={!inputMessage.trim()}
          >
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  newChatButton: {
    padding: 8,
  },
  // Doctor List Styles
  doctorsList: {
    flex: 1,
  },
  doctorsListContent: {
    padding: 20,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  onlineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  doctorInfo: {
    flex: 1,
    gap: 4,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#6B7280',
  },
  lastMessage: {
    gap: 2,
  },
  lastMessageText: {
    fontSize: 14,
    color: '#6B7280',
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // Chat Styles
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  doctorMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userMessage: {
    backgroundColor: '#2563EB',
    maxWidth: '80%',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    padding: 12,
    paddingHorizontal: 16,
  },
  doctorMessage: {
    backgroundColor: '#F3F4F6',
    maxWidth: '80%',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 12,
    paddingHorizontal: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  typingText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  suggestedQuestions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestedQuestionsList: {
    gap: 8,
  },
  suggestedQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestedQuestionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
