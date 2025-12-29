import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
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

const HelpCenter: React.FC<HelpCenterProps> = ({ theme, onBack }) => {
  const { mode } = useThemeContext();

  const helpOptions: HelpOption[] = [
    {
      id: 'live-chat',
      title: 'Live Chat',
      subtitle: 'Chat with our support team instantly',
      icon: 'message-text',
      color: theme.accent,
      action: () => {
        Alert.alert(
          'Live Chat',
          'Connecting you to our support team...',
          [
            { text: 'OK', onPress: () => console.log('Live Chat initiated') }
          ]
        );
      },
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
      action: () => {
        Alert.alert(
          'Raise Ticket',
          'Creating a support ticket for you...',
          [
            { text: 'Create Ticket', onPress: () => console.log('Ticket created') }
          ]
        );
      },
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
});

export default HelpCenter;
