import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemePalette } from '../theme/palette';

type Channel = 'email' | 'sms';

type ForgotPasswordProps = {
  theme: ThemePalette;
  onBack?: () => void;
  onProceed?: (payload: { contact: string; channel: Channel }) => void;
};

const CHANNELS: { id: Channel; title: string; helper: string }[] = [
  { id: 'email', title: 'Email link', helper: 'Receive a secure recovery link.' },
  { id: 'sms', title: 'SMS OTP', helper: 'Get a 6-digit verification code.' },
];

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ theme, onBack, onProceed }) => {
  const [channel, setChannel] = useState<Channel>('email');
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidContact = useMemo(() => {
    const trimmed = contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isPhone = /^\d{10}$/.test(trimmed.replace(/\D/g, ''));
    return isEmail || isPhone;
  }, [contact]);

  const handleSend = () => {
    if (loading) {
      return;
    }
    const trimmedContact = contact.trim();
    if (!isValidContact) {
      setError('Enter a valid email address or 10-digit mobile number.');
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onProceed?.({ contact: trimmedContact, channel });
    }, 600);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {onBack ? (
            <TouchableOpacity onPress={onBack}>
              <Text style={[styles.backLink, { color: theme.textSecondary }]}>‹ Back</Text>
            </TouchableOpacity>
          ) : null}
          <View style={[styles.heroCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
            <View style={[styles.heroAccent, { backgroundColor: theme.hero }]} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Reset your access</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Choose how you’d like to receive recovery help. We’ll guide you through every step.
            </Text>
          </View>
        </View>

        <View>
          <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>Delivery preference</Text>
          <View style={styles.channelRow}>
            {CHANNELS.map(option => {
              const selected = channel === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setChannel(option.id)}
                  style={[
                    styles.channelCard,
                    {
                      borderColor: selected ? theme.hero : theme.border,
                      backgroundColor: selected ? theme.softAccent : theme.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.channelTitle,
                      { color: selected ? theme.hero : theme.textPrimary },
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={[styles.channelHelper, { color: theme.textSecondary }]}>
                    {option.helper}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.form}>
          <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>
            Email or mobile number
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: error ? theme.hero : theme.border,
                color: theme.textPrimary,
                backgroundColor: theme.card,
              },
            ]}
            placeholder="dr.amara@hellodoctor.com / 9876543210"
            placeholderTextColor={theme.textSecondary}
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
          />
          <Text style={[styles.formHint, { color: theme.textSecondary }]}>
            We keep your data private & encrypted. Only official recovery updates will be sent.
          </Text>
          {error ? <Text style={[styles.errorText, { color: theme.hero }]}>{error}</Text> : null}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: isValidContact ? theme.hero : theme.border,
                shadowColor: theme.hero,
              },
            ]}
            onPress={handleSend}
            disabled={!isValidContact || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryText}>
                {channel === 'email' ? 'Send recovery link' : 'Send OTP code'}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={[styles.secondaryNote, { color: theme.textSecondary }]}>
            Can’t access this contact?{' '}
            <Text style={{ color: theme.hero, fontWeight: '700' }}>Reach support</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  content: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 24,
  },
  header: {
    gap: 12,
  },
  heroCard: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  heroAccent: {
    width: 48,
    height: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  backLink: {
    fontSize: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  progress: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 18,
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndex: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepCopy: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  stepSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  channelRow: {
    flexDirection: 'row',
    gap: 12,
  },
  channelCard: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  channelHelper: {
    fontSize: 13,
    lineHeight: 18,
  },
  form: {
    gap: 8,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  formHint: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryNote: {
    textAlign: 'center',
    fontSize: 13,
  },
});

export default ForgotPasswordScreen;
