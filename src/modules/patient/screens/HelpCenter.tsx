import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';

type HelpCenterProps = {
  theme: ThemePalette;
  onBack: () => void;
};

type HelpOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: () => void;
};

type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const HelpCenter: React.FC<HelpCenterProps> = ({ theme, onBack }) => {
  const { mode } = useThemeContext();
  const [showChatModal, setShowChatModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: '',
    description: '',
    priority: 'medium',
  });

  const suggestedQuestions = [
    'How do I book an appointment?',
    'What are your consultation fees?',
    'How to upload medical reports?',
    'Where can I find my prescriptions?',
    'How to cancel an appointment?',
    'What payment methods do you accept?',
    'How to set medicine reminders?',
    'Is my medical data secure?',
  ];

  const supportResponses: { [key: string]: string } = {
    'How do I book an appointment?': 'To book an appointment, go to the Appointments section, select your preferred doctor, choose a suitable time slot, and confirm your booking. You can also filter by specialty and availability.',
    'What are your consultation fees?': 'Our consultation fees vary by doctor specialty and experience. General physician consultations start at ₹299, specialist consultations start at ₹599, and senior consultants start at ₹999.',
    'How to upload medical reports?': 'You can upload medical reports in the Health Records section. Click on "Upload Reports", select the files from your device, and add relevant descriptions. We accept PDF, JPG, and PNG formats.',
    'Where can I find my prescriptions?': 'Your prescriptions are available in the Prescriptions section of the app. You can view, download, or share them with pharmacies. All prescriptions are stored securely.',
    'How to cancel an appointment?': 'To cancel an appointment, go to Appointments, select the upcoming appointment, and tap on "Cancel". Free cancellations are allowed up to 2 hours before the appointment time.',
    'What payment methods do you accept?': 'We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm and PhonePe. Payment is secure and encrypted.',
    'How to set medicine reminders?': 'Go to the Medications section, add your medicines with dosage and timing, and enable reminders. You\'ll receive timely notifications for each dose.',
    'Is my medical data secure?': 'Yes, your medical data is completely secure. We use bank-level encryption, comply with HIPAA standards, and never share your information without explicit consent.',
  };

  const openLiveChat = () => {
    setShowChatModal(true);
    setChatMessages([
      {
        id: '1',
        text: 'Hello! Welcome to HelloDoctor Support. How can I help you today? You can ask me anything about our services.',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  const sendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate support response
    setTimeout(() => {
      const response = supportResponses[message] || 
        'Thank you for your question. Our support team will look into this and get back to you shortly. For immediate assistance, you can call our helpline at 1800-123-4567.';
      
      const supportMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    sendMessage(question);
  };

  const openTicketModal = () => {
    setShowTicketModal(true);
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    setTicketData({
      subject: '',
      category: '',
      description: '',
      priority: 'medium',
    });
  };

  const submitTicket = () => {
    if (!ticketData.subject.trim() || !ticketData.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Generate ticket ID
    const ticketId = 'TKT' + Date.now().toString().slice(-8);
    
    Alert.alert(
      'Ticket Created Successfully',
      `Your ticket ${ticketId} has been created. Our support team will respond within 24 hours.`,
      [
        { text: 'OK', onPress: closeTicketModal }
      ]
    );
  };

  const ticketCategories = [
    'Technical Issue',
    'Appointment Problem',
    'Payment Issue',
    'Account Access',
    'Medical Records',
    'Feature Request',
    'Bug Report',
    'Other',
  ];

  const priorityLevels = [
    { label: 'Low', value: 'low', color: theme.success },
    { label: 'Medium', value: 'medium', color: theme.warning },
    { label: 'High', value: 'high', color: theme.danger },
  ];

  const helpOptions: HelpOption[] = [
    {
      id: 'live-chat',
      title: 'Live Chat',
      subtitle: 'Chat with our support team instantly',
      icon: 'message-text',
      color: theme.accent,
      action: openLiveChat,
    },
    {
      id: 'call-support',
      title: 'Call Support',
      subtitle: 'Call our helpline for immediate assistance',
      icon: 'phone',
      color: theme.success,
      action: () => {
        Alert.alert(
          'Call Support',
          'Our helpline is available 24/7',
          [
            { text: 'Call Now', onPress: () => Linking.openURL('tel:1800-123-4567') },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      },
    },
    {
      id: 'raise-ticket',
      title: 'Raise Ticket',
      subtitle: 'Submit a support ticket for complex issues',
      icon: 'ticket-account',
      color: theme.warning,
      action: openTicketModal,
    },
    {
      id: 'faqs',
      title: 'FAQs',
      subtitle: 'Frequently asked questions and answers',
      icon: 'help-circle',
      color: theme.textSecondary,
      action: () => {
        Alert.alert(
          'FAQs',
          'Opening Frequently Asked Questions...',
          [
            { text: 'View FAQs', onPress: () => console.log('FAQs opened') }
          ]
        );
      },
    },
  ];

  const quickLinks = [
    { title: 'How to upload reports?', icon: 'upload' },
    { title: 'Medicine reminder setup', icon: 'bell' },
    { title: 'Appointment booking', icon: 'calendar-check' },
    { title: 'Privacy settings', icon: 'shield' },
    { title: 'Payment issues', icon: 'credit-card' },
    { title: 'Technical support', icon: 'headset' },
  ];

  const renderHelpOption = (option: HelpOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.helpOption,
        { backgroundColor: theme.card, borderColor: theme.border }
      ]}
      onPress={option.action}
    >
      <View style={styles.optionContent}>
        <View style={[styles.iconContainer, { backgroundColor: option.color + '15' }]}>
          <Icon name={option.icon} size={24} color={option.color} />
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>
            {option.title}
          </Text>
          <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>
            {option.subtitle}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  const renderQuickLink = (link: { title: string; icon: string }, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickLink, { backgroundColor: theme.background, borderColor: theme.border }]}
      onPress={() => {
        Alert.alert(
          'Quick Help',
          `Opening help for: ${link.title}`,
          [
            { text: 'OK', onPress: () => console.log(`Quick help: ${link.title}`) }
          ]
        );
      }}
    >
      <Icon name={link.icon} size={16} color={theme.textSecondary} />
      <Text style={[styles.quickLinkText, { color: theme.textPrimary }]}>
        {link.title}
      </Text>
    </TouchableOpacity>
  );

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.chatMessageContainer,
      item.isUser ? styles.userMessage : styles.supportMessage
    ]}>
      <View style={[
        styles.chatBubble,
        { backgroundColor: item.isUser ? theme.accent : theme.card }
      ]}>
        <Text style={[
          styles.chatText,
          { color: item.isUser ? '#FFFFFF' : theme.textPrimary }
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={[styles.chatTime, { color: theme.textSecondary }]}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const renderSuggestedQuestion = (question: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.suggestedQuestion, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => handleSuggestedQuestion(question)}
    >
      <Text style={[styles.suggestedQuestionText, { color: theme.textPrimary }]}>
        {question}
      </Text>
      <Icon name="send" size={16} color={theme.accent} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.navbar, { backgroundColor: theme.background }]}>
        <View style={styles.navLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>
            Help Center
          </Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={[styles.navButton, { backgroundColor: theme.accent }]}>
            <Icon name="phone" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            How can we help you today?
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Choose an option below or browse our frequently asked questions
          </Text>
        </View>

        <View style={styles.optionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Support Options
          </Text>
          {helpOptions.map(renderHelpOption)}
        </View>

        <View style={styles.quickSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Quick Help
          </Text>
          <View style={styles.quickLinks}>
            {quickLinks.map(renderQuickLink)}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Contact Information
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={theme.accent} />
              <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                Helpline: 1800-123-4567
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color={theme.accent} />
              <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                Email: support@hellodoctor.com
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="clock" size={20} color={theme.accent} />
              <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                Available: 24/7
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.emergencySection}>
          <View style={[styles.emergencyCard, { backgroundColor: theme.danger + '15', borderColor: theme.danger }]}>
            <Icon name="alert-circle" size={24} color={theme.danger} />
            <View style={styles.emergencyContent}>
              <Text style={[styles.emergencyTitle, { color: theme.danger }]}>
                Emergency Support
              </Text>
              <Text style={[styles.emergencyText, { color: theme.textPrimary }]}>
                For medical emergencies, please call 108 immediately
              </Text>
              <TouchableOpacity
                style={[styles.emergencyButton, { backgroundColor: theme.danger }]}
                onPress={() => Linking.openURL('tel:108')}
              >
                <Icon name="phone" size={16} color="#FFFFFF" />
                <Text style={styles.emergencyButtonText}>Call 108</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Live Chat Modal */}
      <Modal
        visible={showChatModal}
        animationType="slide"
        onRequestClose={() => setShowChatModal(false)}
      >
        <View style={[styles.chatContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.chatHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
            <TouchableOpacity
              style={styles.chatBackButton}
              onPress={() => setShowChatModal(false)}
            >
              <Icon name="arrow-left" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <View style={styles.chatHeaderContent}>
              <Text style={[styles.chatTitle, { color: theme.textPrimary }]}>
                Support Chat
              </Text>
              <Text style={[styles.chatSubtitle, { color: theme.textSecondary }]}>
                We typically reply in minutes
              </Text>
            </View>
            <View style={[styles.onlineIndicator, { backgroundColor: theme.success }]} />
          </View>

          <FlatList
            data={chatMessages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContent}
          />

          {chatMessages.length <= 1 && (
            <View style={styles.suggestedQuestionsContainer}>
              <Text style={[styles.suggestedQuestionsTitle, { color: theme.textSecondary }]}>
                Suggested Questions:
              </Text>
              <View style={styles.suggestedQuestions}>
                {suggestedQuestions.map(renderSuggestedQuestion)}
              </View>
            </View>
          )}

          <View style={[styles.chatInputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
            <TextInput
              style={[styles.chatInput, { backgroundColor: theme.background, color: theme.textPrimary }]}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Type your message..."
              placeholderTextColor={theme.textSecondary}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                if (inputMessage.trim()) {
                  sendMessage(inputMessage);
                  setInputMessage('');
                }
              }}
            >
              <Icon name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ticket Modal */}
      <Modal
        visible={showTicketModal}
        animationType="slide"
        onRequestClose={closeTicketModal}
      >
        <View style={[styles.ticketContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.ticketHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
            <TouchableOpacity
              style={styles.ticketBackButton}
              onPress={closeTicketModal}
            >
              <Icon name="arrow-left" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <View style={styles.ticketHeaderContent}>
              <Text style={[styles.ticketTitle, { color: theme.textPrimary }]}>
                Raise Support Ticket
              </Text>
              <Text style={[styles.ticketSubtitle, { color: theme.textSecondary }]}>
                We'll respond within 24 hours
              </Text>
            </View>
          </View>

          <ScrollView style={styles.ticketContent} contentContainerStyle={styles.ticketContentContainer}>
            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                Subject *
              </Text>
              <TextInput
                style={[styles.formInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }]}
                value={ticketData.subject}
                onChangeText={(text) => setTicketData(prev => ({ ...prev, subject: text }))}
                placeholder="Brief description of your issue"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                Category
              </Text>
              <View style={styles.categoryGrid}>
                {ticketCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: ticketData.category === category ? theme.accent : theme.card,
                        borderColor: theme.border,
                      }
                    ]}
                    onPress={() => setTicketData(prev => ({ ...prev, category }))}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      {
                        color: ticketData.category === category ? '#FFFFFF' : theme.textPrimary
                      }
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                Priority
              </Text>
              <View style={styles.priorityContainer}>
                {priorityLevels.map((priority) => (
                  <TouchableOpacity
                    key={priority.value}
                    style={[
                      styles.priorityOption,
                      {
                        backgroundColor: ticketData.priority === priority.value ? priority.color + '15' : theme.card,
                        borderColor: ticketData.priority === priority.value ? priority.color : theme.border,
                      }
                    ]}
                    onPress={() => setTicketData(prev => ({ ...prev, priority: priority.value }))}
                  >
                    <View style={[
                      styles.priorityDot,
                      { backgroundColor: priority.color }
                    ]} />
                    <Text style={[
                      styles.priorityText,
                      {
                        color: ticketData.priority === priority.value ? priority.color : theme.textPrimary
                      }
                    ]}>
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                Description *
              </Text>
              <TextInput
                style={[
                  styles.formTextarea,
                  { backgroundColor: theme.card, borderColor: theme.border, color: theme.textPrimary }
                ]}
                value={ticketData.description}
                onChangeText={(text) => setTicketData(prev => ({ ...prev, description: text }))}
                placeholder="Please provide detailed information about your issue..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.accent }]}
              onPress={submitTicket}
            >
              <Icon name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Submit Ticket</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickSection: {
    gap: 16,
  },
  quickLinks: {
    gap: 12,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  infoSection: {
    gap: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emergencySection: {
    gap: 16,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  emergencyContent: {
    flex: 1,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  emergencyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7F1D1D',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Chat Modal Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  chatBackButton: {
    padding: 8,
  },
  chatHeaderContent: {
    flex: 1,
    marginLeft: 12,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  chatSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 20,
  },
  chatMessageContainer: {
    marginVertical: 8,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  supportMessage: {
    alignItems: 'flex-start',
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
  },
  chatText: {
    fontSize: 16,
    lineHeight: 22,
  },
  chatTime: {
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  suggestedQuestionsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestedQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestedQuestions: {
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
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  chatInput: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Ticket Modal Styles
  ticketContainer: {
    flex: 1,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  ticketBackButton: {
    padding: 8,
  },
  ticketHeaderContent: {
    flex: 1,
    marginLeft: 12,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  ticketSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  ticketContent: {
    flex: 1,
  },
  ticketContentContainer: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  formTextarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    height: 120,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HelpCenter;
