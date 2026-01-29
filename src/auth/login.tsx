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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemePalette } from '../theme/palette';
import { checkUserExistence, loginUser } from '../utils/api';
import { saveUserSession } from '../utils/storage';

Icon.loadFont();

type LoginScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
  onSignupPress?: () => void;
  onSuccess?: (role?: 'patient' | 'doctor') => void;
  onOtpRequest?: (payload: { contact: string; channel: 'sms'; role?: 'doctor' | 'patient'; userId?: string; token?: string }) => void;
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
  const [userFound, setUserFound] = useState(false);

  const showSnack = (message: string) => {
    setSnackMessage(message);
    setSnackVisible(true);
  };

  const trimmedContact = contact.trim();
  const isEmail = trimmedContact.includes('@');
  const showPasswordField = isEmail;

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidPhone = (value: string) =>
    /^\d{10}$/.test(value.replace(/\D/g, ''));

  const handleNext = async () => {
    const trimmed = contact.trim();
    const isEmailInput = isEmail;
    const isPhoneInput = isValidPhone(trimmed);

    if (!isEmailInput && !isPhoneInput) {
      setContactError('Enter valid email address or 10-digit phone number');
      return;
    }
    setContactError(null);

    setLoading(true);
    try {
      // Step 1: Check if user exists in database
      const cleanContact = isPhoneInput ? trimmed.replace(/\D/g, '') : trimmed;
      const response = await checkUserExistence(cleanContact);
      console.log('User Found Response:', response);

      // Verify if the response actually contains user data
      // (Backend might return 200 OK with success:false or empty user for unregistered)
      const role = response.role || response.user?.role || response.data?.user?.role || response.data?.role;
      const userId = response.id || response.user?.id || response.data?.user?.id || response._id || response.user?._id;
      const userExists = !!(response.user || response.data?.user || response.role || response.data?.role);

      if (!userExists) {
        throw new Error('User not registered');
      }

      if (isEmailInput) {
        // For email, just unlock the password field
        setUserFound(true);
        showSnack('User found. Enter password.');
      } else {
        // For phone, proceed to OTP screen
        onOtpRequest?.({ 
          contact: cleanContact, 
          channel: 'sms', 
          role: role || 'patient',
          userId: userId, // Path the userId forward
          token: response.token // Include the token
        });
        showSnack('User verified. Sending code...');
      }
    } catch (error: any) {
      console.error('User Check Error:', error.message);
      
      const errorMsg = isEmailInput 
        ? 'Email not registered. Please sign up.' 
        : 'Phone number not registered.';
      
      setContactError(errorMsg);
      showSnack(errorMsg);
      
      // Removed Alert.alert as per user request to show on UI
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleEmailLogin = async () => {
    const trimmed = contact.trim();
    const hasPassword = password.trim().length > 0;

    setPasswordError(hasPassword ? null : 'Password is required');
    if (!hasPassword) return;

    setLoading(true);
    try {
      const response = await loginUser({
        email: trimmed,
        password: password.trim(),
      });
      setLoading(false);
      showSnack('Login successful');
      
      const role = response.role || response.user?.role || 'patient';
      
      // Save session locally
      await saveUserSession({ ...response, role });
      
      setTimeout(() => {
        setLoading(false);
        onSuccess?.(role);
      }, 1000);
    } catch (error: any) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
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
              onChangeText={(txt) => {
                setContact(txt);
                setUserFound(false); // Reset check if contact changes
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={true}
            />
          </View>

          <View style={styles.infoRow}>
            {contactError ? (
              <Icon name="error-outline" size={16} color={theme.hero} />
            ) : (
              <Icon name="info-outline" size={16} color={theme.textSecondary} />
            )}
            <Text style={[styles.infoText, { color: contactError ? theme.hero : theme.textSecondary }]}>
              {contactError ??
                (showPasswordField
                  ? 'Enter your password to continue'
                  : "We'll send you an OTP to verify")}
            </Text>
          </View>

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
            onPress={isEmail ? handleEmailLogin : handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>
                {isEmail ? 'Login' : 'Send OTP'}
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

      {loading && (
        <View style={styles.loaderOverlay}>
           <View style={[styles.loaderContent, { backgroundColor: theme.card }]}>
              <ActivityIndicator size="large" color={theme.hero} />
              <Text style={[styles.loaderText, { color: theme.textPrimary }]}>
                {isEmail ? 'Logging in...' : 'Authenticating...'}
              </Text>
           </View>
        </View>
      )}

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
    top: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.95)', // Reddish for error visibility
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 20,
  },
  snackbarText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContent: {
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  loaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LoginScreen;
