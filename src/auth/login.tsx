import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemePalette } from '../theme/palette';

Icon.loadFont();

type LoginScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
  onSignupPress?: () => void;
  onSuccess?: () => void;
  onOtpRequest?: (payload: { contact: string; channel: 'sms' }) => void;
  onForgotPress?: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({
  theme,
  onBack,
  onSignupPress,
  onSuccess,
  onOtpRequest,
  onForgotPress,
}) => {
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  const showSnack = (message: string) => {
    setSnackMessage(message);
    setSnackVisible(true);
  };

  const trimmedContact = contact.trim();
  const showPasswordField = trimmedContact.includes('@');

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidPhone = (value: string) =>
    /^\d{10}$/.test(value.replace(/\D/g, ''));

  const handleSendOtp = () => {
    const trimmed = contact.trim();
    const valid = isValidPhone(trimmed);

    setContactError(valid ? null : 'Enter valid 10-digit phone number');
    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOtpRequest?.({ contact: trimmed, channel: 'sms' });
      showSnack('Login successful');
    }, 1000);
  };

  const handleEmailLogin = () => {
    const trimmed = contact.trim();
    const isEmail = isValidEmail(trimmed);
    const hasPassword = password.trim().length > 0;

    setContactError(isEmail ? null : 'Enter valid email address');
    setPasswordError(hasPassword ? null : 'Password is required');
    if (!isEmail || !hasPassword) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSnack('Login successful');
      onSuccess?.();
    }, 1000);
  };

  useEffect(() => {
    if (!snackVisible) return;
    const timer = setTimeout(() => setSnackVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [snackVisible]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.hero }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.brandBadge}>
          {onBack && (
            <TouchableOpacity onPress={onBack}>
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>
          )}

          <View style={styles.logoCircle}>
            <Image
              source={require('../screens/image/logo.png')}
              style={styles.logoImage}
            />
          </View>

          <Text style={styles.brandTitle}>Hello Doctor</Text>
          <Text style={styles.brandSubtitle}>Your Health, Our Priority</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Login to continue
          </Text>

          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: contactError ? theme.hero : theme.border,
                backgroundColor: theme.background,
              },
            ]}
          >
            <Icon name="person" size={24} color={theme.textPrimary} />

            <TextInput
              style={[styles.input, { color: theme.textPrimary }]}
              placeholder="Enter phone number or email"
              placeholderTextColor={theme.textSecondary}
              value={contact}
              onChangeText={setContact}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={{ color: contactError ? theme.hero : theme.textSecondary }}>
            {contactError ??
              (showPasswordField
                ? 'Enter your password to continue'
                : "We'll send you an OTP to verify")}
          </Text>

          {showPasswordField && (
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: passwordError ? theme.hero : theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            >
              <Icon name="lock" size={22} color={theme.textPrimary} />

              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          )}

          {showPasswordField && passwordError && (
            <Text style={{ color: theme.hero }}>{passwordError}</Text>
          )}

          {showPasswordField && onForgotPress && (
            <TouchableOpacity onPress={onForgotPress}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.hero }]}
            onPress={showPasswordField ? handleEmailLogin : handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>
                {showPasswordField ? 'Login' : 'Send OTP'}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Text style={styles.footerHighlight} onPress={onSignupPress}>
              Register Now
            </Text>
          </Text>
        </View>
      </ScrollView>
      {snackVisible && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{snackMessage}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 24,
  },
  brandBadge: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  brandSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    padding: 24,
    gap: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    marginLeft: 8,
  },
  primaryButton: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 8,
  },
  footerHighlight: {
    color: '#007BFF',
    fontWeight: '700',
  },
  backText: {
    color: '#fff',
    marginBottom: 8,
  },
  forgotText: {
    alignSelf: 'flex-end',
    color: '#007BFF',
    fontWeight: '600',
  },
  snackbar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  snackbarText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LoginScreen;
