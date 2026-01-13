import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../theme/palette';
import { registerUser } from '../utils/api';


type Role = 'patient' | 'doctor';

type SignupScreenProps = {
  theme: ThemePalette;
  onBack?: () => void;
  onOtpRequest?: (payload: { contact: string; role: Role }) => void;
  onSuccess?: (role: Role) => void;
};

const SignupScreen: React.FC<SignupScreenProps> = ({
  theme,
  onBack,
  onOtpRequest,
  onSuccess,
}) => {
  const [role, setRole] = useState<Role>('patient');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const age = useMemo(() => calculateAge(dob), [dob]);
  const phoneValid = useMemo(() => isValidPhone(phone), [phone]);
  const emailValid = useMemo(() => isValidEmail(email), [email]);

  const isValid = useMemo(() => {
    if (isDoctor) {
      return (
        name &&
        phoneValid &&
        emailValid &&
        department &&
        password
      );
    }
    return Boolean(name && phoneValid && emailValid && password && age !== null);
  }, [
    name,
    phoneValid,
    emailValid,
    department,
    password,
    isDoctor,
    age,
  ]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    setPhone(digits);
    if (!digits) {
      setPhoneError('Phone number is required');
    } else if (!isValidPhone(digits)) {
      setPhoneError('Enter 10-digit number');
    } else {
      setPhoneError(null);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value.trim());
    if (!value.trim()) {
      setEmailError('Email is required');
    } else if (!isValidEmail(value.trim())) {
      setEmailError('Enter valid email address');
    } else {
      setEmailError(null);
    }
  };

  const handleSignup = async () => {
    if (!phoneValid) {
      setPhoneError('Enter 10-digit number');
    }
    if (!emailValid) {
      setEmailError('Enter valid email address');
    }
    if (!isValid) return;

    setLoading(true);
    try {
      const payload = {
        name,
        phone,
        email,
        password,
        role,
        ...(isDoctor ? { department } : { dob, age }),
      };

      const response = await registerUser(payload);
      
      console.log('Registration success:', response);
      
      const contact = phone.trim();
      if (contact) {
        onOtpRequest?.({ contact, role });
      } else {
        onSuccess?.(role);
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Unable to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.hero }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.hero }]}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../screens/image/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>Create Account</Text>
          <Text style={styles.heroSubtitle}>Join HealthCare+ today</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Register</Text>
          <Text style={styles.sectionSubtitle}>
            Are you a Doctor or User?
          </Text>

          <View style={styles.roleRow}>
            {(['patient', 'doctor'] as Role[]).map(value => {
              const selected = role === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.roleOption,
                    selected ? styles.roleOptionActive : undefined,
                  ]}
                  onPress={() => setRole(value)}
                >
                  <Icon
                    name={
                      value === 'doctor'
                        ? 'stethoscope'
                        : 'account-multiple-outline'
                    }
                    size={28}
                    color={selected ? '#2A6EF4' : '#9AA7C2'}
                  />
                  <Text
                    style={[
                      styles.roleLabel,
                      { color: selected ? '#2A6EF4' : '#6A768E' },
                    ]}
                  >
                    {value === 'doctor' ? 'Doctor' : 'User'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.form}>
            <Field
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              iconName="account-outline"
            />

            <Field
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              iconName="phone-outline"
              error={phoneError}
            />

            <Field
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              iconName="email-outline"
              error={emailError}
            />

            {isPatient && (
              <View style={styles.inlineRow}>
                <Field
                  label="Date of Birth"
                  placeholder="DD/MM/YYYY"
                  value={dob}
                  onChangeText={value => setDob(formatDobInput(value))}
                  keyboardType="number-pad"
                  maxLength={10}
                  iconName="calendar-month-outline"
                  containerStyle={styles.inlineField}
                />
                <Field
                  label="Age"
                  placeholder="age"
                  value={age !== null ? `${age}` : ''}
                  editable={false}
                  iconName="counter"
                  containerStyle={[styles.inlineField, styles.ageField]}
                />
              </View>
            )}

            {isDoctor && (
              <Field
                label="Department"
                placeholder="Cardiology"
                value={department}
                onChangeText={setDepartment}
                iconName="office-building-outline"
              />
            )}

            <Field
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              iconName="lock-outline"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { opacity: isValid ? 1 : 0.6 },
            ]}
            disabled={!isValid || loading}
            onPress={handleSignup}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryText}>Continue</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.loginText} onPress={onBack}>
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

type FieldProps = {
  label: string;
  iconName: string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string | null;
} & React.ComponentProps<typeof TextInput>;

const Field: React.FC<FieldProps> = ({
  label,
  iconName,
  containerStyle,
  error,
  ...props
}) => (
  <View style={[styles.field, containerStyle]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Icon name={iconName} size={20} color="#8B9ABB" />
      <TextInput
        style={styles.input}
        placeholderTextColor="#A0AEC3"
        {...props}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1D7BFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#1D7BFF',
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  scrollContainer: {
    padding: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#E2EEFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    gap: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B2A4E',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6A768E',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E1E7F5',
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7F9FC',
  },
  roleOptionActive: {
    borderColor: '#2A6EF4',
    backgroundColor: '#E8F1FF',
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineField: {
    flex: 1,
  },
  ageField: {
    flex: 0.85,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B2A4E',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E7F5',
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#F7F9FC',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1B2A4E',
    marginLeft: 10,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#2A6EF4',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    color: '#6A768E',
    marginTop: 8,
  },
  loginText: {
    color: '#2A6EF4',
    fontWeight: '600',
  },
});

function calculateAge(value: string): number | null {
  if (value.length !== 10) return null;
  const [dayStr, monthStr, yearStr] = value.split('/');
  const day = Number(dayStr);
  const month = Number(monthStr) - 1;
  const year = Number(yearStr);

  const dobDate = new Date(year, month, day);
  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    dobDate.getDate() !== day ||
    dobDate.getMonth() !== month ||
    dobDate.getFullYear() !== year
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthdayThisYear =
    today.getMonth() > month ||
    (today.getMonth() === month && today.getDate() >= day);
  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length <= 2) return day;
  if (digits.length <= 4) return `${day}/${month}`;
  return `${day}/${month}/${year}`;
}

function isValidPhone(value: string) {
  return /^\d{10}$/.test(value);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default SignupScreen;
