import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginScreen from '../auth/login';
import SignupScreen from '../auth/singnup';
import ForgotPasswordScreen from '../auth/forgotpassword';
import OTPVerificationScreen from '../auth/otpverification';
import PatientTabs from '../modules/patient/screens/PatientTabs';
import DoctorTabs from '../modules/doctor/screens/DoctorTabs';
import { useThemeContext } from '../theme/ThemeContext';
import { ThemePalette } from '../theme/palette';

type AppScreen = 'login' | 'signup' | 'forgot' | 'otp' | 'home' | 'doctor_home';
type OtpPayload = {
  contact: string;
  channel: 'email' | 'sms';
  backScreen: AppScreen;
  successScreen: AppScreen;
};
type RecoveryPayload = OtpPayload | null;
type NavigationState = {
  screen: AppScreen;
  recoveryPayload: RecoveryPayload;
};

const RootNavigator = () => {
  const { theme, mode } = useThemeContext();
  const [navState, setNavState] = useState<NavigationState>({
    screen: 'login',
    recoveryPayload: null,
  });
  const insets = useSafeAreaInsets();

  const setScreen = (next: AppScreen, payload?: RecoveryPayload) =>
    setNavState(() => ({
      screen: next,
      recoveryPayload: next === 'otp' ? payload ?? null : null,
    }));

  const { screen, recoveryPayload } = navState;

  const handleHardwareBack = useCallback(() => {
    switch (screen) {
      case 'signup':
      case 'forgot':
        setScreen('login');
        return true;
      case 'otp': {
        const fallback = recoveryPayload?.backScreen ?? 'login';
        setScreen(fallback, recoveryPayload);
        return true;
      }
      default:
        return false;
    }
  }, [screen, recoveryPayload]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleHardwareBack,
    );
    return () => subscription.remove();
  }, [handleHardwareBack]);

  const renderScreen = (palette: ThemePalette) => {
    switch (screen) {
      case 'login':
        return (
          <LoginScreen
            theme={palette}
            onSignupPress={() => setScreen('signup')}
            onForgotPress={() => setScreen('forgot')}
            onSuccess={(role) => setScreen(role === 'doctor' ? 'doctor_home' : 'home')}
            onOtpRequest={payload =>
              setScreen('otp', {
                contact: payload.contact,
                channel: payload.channel,
                backScreen: 'login',
                successScreen: payload.role === 'doctor' ? 'doctor_home' : 'home',
              })
            }
          />
        );
      case 'signup':
        return (
          <SignupScreen
            theme={palette}
            onBack={() => setScreen('login')}
            onOtpRequest={contact =>
              setScreen('otp', {
                contact,
                channel: 'sms',
                backScreen: 'signup',
                successScreen: 'home',
              })
            }
            onSuccess={() => setScreen('home')}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordScreen
            theme={palette}
            onBack={() => setScreen('login')}
            onProceed={payload => {
              setScreen('otp', {
                contact: payload.contact,
                channel: payload.channel,
                backScreen: 'forgot',
                successScreen: 'login',
              });
            }}
          />
        );
      case 'otp':
        return (
          <OTPVerificationScreen
            theme={palette}
            defaultContact={recoveryPayload?.contact}
            defaultChannel={recoveryPayload?.channel}
            onBack={() => setScreen(recoveryPayload?.backScreen ?? 'login')}
            onSuccess={() => setScreen(recoveryPayload?.successScreen ?? 'login')}
          />
        );
      case 'doctor_home':
        return <DoctorTabs theme={palette} onLogout={() => setScreen('login')} />;
      case 'home':
      default:
        return <PatientTabs theme={palette} onLogout={() => setScreen('login')} />;
    }
  };

  const heroScreens: AppScreen[] = ['login', 'signup', 'forgot', 'otp'];
  const containerColor = heroScreens.includes(screen)
    ? theme.hero
    : theme.background;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={containerColor}
      />
      {renderScreen(theme)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootNavigator;
