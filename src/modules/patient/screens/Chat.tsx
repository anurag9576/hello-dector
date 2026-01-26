import React, { useState, useRef } from 'react';
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { doctors as allDoctors, Doctor as GlobalDoctor } from '../../../data/doctors';
import { ThemePalette } from '../../../theme/palette';
import { usePatientProfile } from '../hooks/usePatientProfile';

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
  text?: string;
  imageUri?: string;
  isUser: boolean;
  timestamp: Date;
  sender?: string;
};

type ChatProps = {
  theme: ThemePalette;
  onBack: () => void;
};

const WhatsAppColors = {
  header: '#F8FAFC',
  background: '#ECE5DD',
  userBubble: '#DCF8C6',
  otherBubble: '#FFFFFF',
  text: '#010101',
  secondaryText: '#757575',
  sendButton: '#075E54',
  inputIcons: '#757575',
  check: '#34B7F1',
};

// Seed doctors for initial state
const initialDoctors: Doctor[] = [
  {
    id: 'Dr. Raghav Mehta',
    name: 'Dr. Raghav Mehta',
    specialty: 'Neurologist',
    lastMessage: 'Check the Neurological report...',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    isOnline: true,
    initials: 'RM',
  },
  {
    id: 'Dr. Priya Sharma',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    lastMessage: 'Your ECG is fine.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    initials: 'PS',
  },
];

const Chat: React.FC<ChatProps> = ({ theme, onBack }) => {
  const { patientMeta } = usePatientProfile();
  const [activeDoctors, setActiveDoctors] = useState<Doctor[]>(initialDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSelectingDoctor, setIsSelectingDoctor] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messagesByDoctor, setMessagesByDoctor] = useState<Record<string, ChatMessage[]>>({
    'Dr. Raghav Mehta': [
      { id: '1', text: 'Hello! I\'m Dr. Raghav Mehta. How can I help you today?', isUser: false, timestamp: new Date(Date.now() - 3600000), sender: 'Dr. Raghav Mehta' },
      { id: '2', text: 'Good morning doctor. I\'ve been experiencing frequent headaches lately.', isUser: true, timestamp: new Date(Date.now() - 3000000) },
    ],
    'Dr. Priya Sharma': [
      { id: '3', text: 'Hello, I have reviewed your test results. Everything looks normal.', isUser: false, timestamp: new Date(Date.now() - 86400000), sender: 'Dr. Priya Sharma' },
    ]
  });

  // Filter doctors: only show those we have chatted with
  const filteredDoctors = activeDoctors.filter(doc => {
    const hasMessages = messagesByDoctor[doc.id] && messagesByDoctor[doc.id].length > 0;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return hasMessages && matchesSearch;
  });

  const selectedDoctorData = activeDoctors.find(doc => doc.id === selectedDoctor);

  const handleSelectDoctor = (doctor: GlobalDoctor) => {
    // Check if hero is already in chat list
    const existing = activeDoctors.find(d => d.name === doctor.name);
    if (!existing) {
      const newChatDoc: Doctor = {
        id: doctor.name,
        name: doctor.name,
        specialty: doctor.specialty,
        lastMessage: 'Starting a new conversation...',
        lastMessageTime: 'Now',
        unreadCount: 0,
        isOnline: true,
        initials: doctor.name.substring(0, 2).toUpperCase(),
      };
      setActiveDoctors(prev => [newChatDoc, ...prev]);
      setSelectedDoctor(newChatDoc.id);
    } else {
      setSelectedDoctor(existing.id);
    }
    setIsSelectingDoctor(false);
  };



  const currentMessages = selectedDoctor ? (messagesByDoctor[selectedDoctor] || []) : [];

  const sendMessage = (text?: string, imageUri?: string) => {
    if ((text?.trim() || imageUri) && selectedDoctor) {
      const displayTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const messagePreview = text?.trim() || (imageUri ? '📷 Photo' : '');

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: text?.trim(),
        imageUri,
        isUser: true,
        timestamp: new Date(),
      };

      setMessagesByDoctor(prev => ({
        ...prev,
        [selectedDoctor]: [...(prev[selectedDoctor] || []), newMessage]
      }));
      
      // Move doctor to top and update preview
      setActiveDoctors(prev => {
        const docIndex = prev.findIndex(d => d.id === selectedDoctor);
        if (docIndex === -1) return prev;
        const updatedDoc = { ...prev[docIndex], lastMessage: messagePreview, lastMessageTime: displayTime };
        const otherDocs = prev.filter(d => d.id !== selectedDoctor);
        return [updatedDoc, ...otherDocs];
      });

      setInputMessage('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

      if (!imageUri) {
        setIsTyping(true);
        setTimeout(() => {
          const responseText = 'I have received your message. How else can I assist you?';
          const doctorResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            isUser: false,
            timestamp: new Date(),
            sender: selectedDoctor,
          };
          
          setMessagesByDoctor(prev => ({
            ...prev,
            [selectedDoctor]: [...(prev[selectedDoctor] || []), doctorResponse]
          }));

          // Updated doctor preview for response
          setActiveDoctors(prev => {
            const docIndex = prev.findIndex(d => d.id === selectedDoctor);
            if (docIndex === -1) return prev;
            const updatedDoc = { ...prev[docIndex], lastMessage: responseText, lastMessageTime: 'Now' };
            const otherDocs = prev.filter(d => d.id !== selectedDoctor);
            return [updatedDoc, ...otherDocs];
          });

          setIsTyping(false);
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }, 2000);
      }
    }
  };

  const handleCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets[0].uri) sendMessage(undefined, result.assets[0].uri);
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets[0].uri) sendMessage(undefined, result.assets[0].uri);
  };

  const renderDoctorItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity style={styles.doctorItem} onPress={() => setSelectedDoctor(item.id)} activeOpacity={0.7}>
      <View style={[styles.listAvatar, { backgroundColor: theme.softAccent }]}>
        <Icon name="account" size={36} color={theme.accent} />
        {item.isOnline && <View style={[styles.onlineDot, { backgroundColor: '#22C55E' }]} />}
      </View>
      <View style={styles.doctorInfo}>
        <View style={styles.doctorHeader}>
          <Text style={[styles.doctorName, { color: theme.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.lastMessageTime, { color: theme.textSecondary }]}>{item.lastMessageTime}</Text>
        </View>
        <View style={styles.lastMessageRow}>
          <Text style={[styles.lastMessageText, { color: theme.textSecondary }]} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.accent }]}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessageAlign : styles.otherMessageAlign]}>
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.otherBubble]}>
        {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.messageImage} />}
        {item.text && <Text style={styles.messageText}>{item.text}</Text>}
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          {item.isUser && <Icon name="check-all" size={16} color={WhatsAppColors.check} style={styles.checkIcon} />}
        </View>
      </View>
    </View>
  );

  // Selector View (Top Doctors)
  if (isSelectingDoctor) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setIsSelectingDoctor(false)}>
            <Icon name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary, flex: 1 }]}>Top Doctors</Text>
        </View>
        <FlatList
          data={allDoctors}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.doctorItem} onPress={() => handleSelectDoctor(item)}>
              <View style={[styles.listAvatar, { backgroundColor: theme.softAccent }]}>
                <Icon name="account" size={32} color={theme.accent} />
              </View>
              <View style={styles.doctorInfo}>
                <Text style={[styles.doctorName, { color: theme.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.lastMessageText, { color: theme.textSecondary }]}>{item.specialty} • {item.experience}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Doctor List View
  if (!selectedDoctor) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          {!isSearchVisible ? (
            <>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Icon name="arrow-left" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: theme.textPrimary, flex: 1 }]}>Chats</Text>
              <TouchableOpacity style={styles.headerIconButton} onPress={() => setIsSearchVisible(true)}>
                <Icon name="magnify" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.searchBarWrapper}>
              <TouchableOpacity style={styles.backButton} onPress={() => { setIsSearchVisible(false); setSearchTerm(''); }}>
                <Icon name="arrow-left" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
              <TextInput
                style={[styles.headerSearchInput, { color: theme.textPrimary }]}
                placeholder="Search chats..."
                placeholderTextColor={theme.textSecondary}
                value={searchTerm}
                onChangeText={setSearchTerm}
                autoFocus
              />
              {searchTerm.length > 0 && <TouchableOpacity onPress={() => setSearchTerm('')}><Icon name="close" size={22} color={theme.textSecondary} /></TouchableOpacity>}
            </View>
          )}
        </View>
        <FlatList data={filteredDoctors} renderItem={renderDoctorItem} keyExtractor={item => item.id} style={styles.doctorsList} />
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.accent }]} onPress={() => setIsSelectingDoctor(true)}>
          <Icon name="message-plus" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  // Chat View
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <View style={[styles.container, { backgroundColor: WhatsAppColors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedDoctor(null)}>
            <Icon name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>{selectedDoctorData?.name}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>{selectedDoctorData?.isOnline ? 'online' : 'last seen recently'}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconButton}><Icon name="video" size={24} color={theme.textPrimary} /></TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}><Icon name="phone" size={22} color={theme.textPrimary} /></TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={currentMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && <View style={styles.typingBubble}><Text style={styles.typingText}>typing...</Text></View>}

        <View style={styles.chatInputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.inputIconButton}><Icon name="emoticon-outline" size={24} color={WhatsAppColors.inputIcons} /></TouchableOpacity>
            <TextInput style={styles.chatInput} value={inputMessage} onChangeText={setInputMessage} placeholder="Message" placeholderTextColor={WhatsAppColors.secondaryText} multiline />
            <TouchableOpacity style={styles.inputIconButton} onPress={handleGallery}><Icon name="paperclip" size={24} color={WhatsAppColors.inputIcons} /></TouchableOpacity>
            <TouchableOpacity style={styles.inputIconButton} onPress={handleCamera}><Icon name="camera" size={24} color={WhatsAppColors.inputIcons} /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.whatsappSendBtn} onPress={() => sendMessage(inputMessage)}>
            <Icon name={inputMessage.trim() ? "send" : "microphone"} size={24} color="#FFFFFF" />
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
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 1,
    opacity: 0.7,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    padding: 6,
  },
  // Doctor List Item
  doctorsList: {
    flex: 1,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  listAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorInfo: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  lastMessageTime: {
    fontSize: 12,
  },
  lastMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageText: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  // Chat Messages
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 4,
    width: '100%',
  },
  userMessageAlign: {
    alignItems: 'flex-end',
  },
  otherMessageAlign: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    maxWidth: '85%',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  userBubble: {
    backgroundColor: WhatsAppColors.userBubble,
  },
  otherBubble: {
    backgroundColor: WhatsAppColors.otherBubble,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.6,
  },
  checkIcon: {
    marginLeft: 4,
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingText: {
    opacity: 0.6,
    fontStyle: 'italic',
    fontSize: 12,
  },
  // WhatsApp Chat Input
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    minHeight: 48,
    maxHeight: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  chatInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  inputIconButton: {
    padding: 8,
  },
  whatsappSendBtn: {
    backgroundColor: '#075E54',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
});

export default Chat;
