import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  InteractionManager,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemePalette } from '../theme/palette';

Icon.loadFont();

type OTPVerificationProps = {
  theme: ThemePalette;
  defaultContact?: string;
  defaultChannel?: 'email' | 'sms';
  onBack?: () => void;
  onSuccess?: () => void;
};

const OTPVerificationScreen: React.FC<OTPVerificationProps> = ({
  theme,
  defaultContact = '',
  defaultChannel = 'email',
  onBack,
  onSuccess,
}) => {
  const contact = defaultContact.trim();
  const [channel] = useState<'email' | 'sms'>(defaultChannel);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [mockOtp, setMockOtp] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Sending secure code...');
  const [timer, setTimer] = useState(44);
  const hiddenInputRef = useRef<TextInput>(null);

  const launchOtp = () => {
    if (sending) {
      return;
    }
    setOtpValue('');
    setOtpError(null);
    setSending(true);
    setStatus('Sending secure code...');
    setTimer(44);
    hiddenInputRef.current?.focus();

    setTimeout(() => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(otp);
      setSending(false);
      setStatus(`Code sent to ${contact || 'your contact'}`);
    }, 800);
  };

  useEffect(() => {
    launchOtp();
    const focusHandle = InteractionManager.runAfterInteractions(() => {
      hiddenInputRef.current?.focus();
    });
    return () => {
      focusHandle.cancel();
    };
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }
    const id = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleVerify = () => {
    if (verifying || !mockOtp) {
      return;
    }
    if (otpValue.length !== 6) {
      setOtpError('Enter the 6-digit code.');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      if (otpValue === mockOtp) {
        setOtpError(null);
        onSuccess?.();
      } else {
        setOtpError('Incorrect code. Please try again.');
      }
      setVerifying(false);
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.hero }]}
    >
      <View style={styles.surface}>
        {onBack ? (
          <TouchableOpacity onPress={onBack}>
            <Text style={[styles.backLink]}>‹ Back</Text>
          </TouchableOpacity>
        ) : null}

        <View style={[styles.heroPanel, { backgroundColor: theme.hero }]}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../screens/image/logo.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.panelTitle}>OTP Verification</Text>
          <Text style={styles.panelSubtitle}>
            Enter the 6-digit code sent to {contact || '+91 1234567890'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Enter OTP</Text>
            {mockOtp ? <Text style={styles.mockOtpTag}>Mock: {mockOtp}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.digitStack}
            activeOpacity={1}
            onPress={() => hiddenInputRef.current?.focus()}
          >
            <View style={styles.digitGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.digitCell,
                    {
                      borderColor: otpError ? theme.hero : '#dbeafe',
                      backgroundColor: '#F8FBFF',
                    },
                  ]}
                >
                  <Text style={[styles.digitText, { color: theme.textPrimary }]}>
                    {otpValue[index] ?? ''}
                  </Text>
                </View>
              ))}
            </View>
            <TextInput
              ref={hiddenInputRef}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              inputMode="numeric"
              value={otpValue}
              maxLength={6}
              onChangeText={value => {
                setOtpValue(value.replace(/\D/g, ''));
                setOtpError(null);
              }}
              autoFocus
              caretHidden
              textContentType="oneTimeCode"
              importantForAutofill="no"
            />
          </TouchableOpacity>
          {otpError ? <Text style={[styles.errorText]}>{otpError}</Text> : null}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>
              {timer > 0 ? `Resend OTP in ${timer}s` : status}
            </Text>
            <TouchableOpacity onPress={launchOtp} disabled={timer > 0 || sending}>
              <Text
                style={[
                  styles.resendAction,
                  { opacity: timer > 0 || sending ? 0.4 : 1 },
                ]}
              >
                Resend
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: otpValue.length === 6 ? theme.hero : 'rgba(30,136,229,0.35)',
              },
            ]}
            onPress={handleVerify}
            disabled={otpValue.length !== 6 || verifying}
          >
            {verifying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryText}>Verify & Continue</Text>
            )}
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  surface: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 18,
  },
  backLink: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  heroPanel: {
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderColor: '#aba3a3ff',
    borderWidth: 3,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  panelSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 30,
    padding: 28,
    gap: 16,
    shadowColor: '#0b225b',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 15 },
    elevation: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '700',
  },
  mockOtpTag: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  digitGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  digitStack: {
    position: 'relative',
  },
  digitCell: {
    flex: 1,
    minWidth: 42,
    borderWidth: 2,
    borderRadius: 18,
    aspectRatio: 0.95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resendLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  resendAction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E88E5',
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  mockOtp: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
});

export default OTPVerificationScreen;
