import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SettingsScreenProps = {
  theme: ThemePalette;
  onBack: () => void;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ theme, onBack }) => {
  const { mode, setMode } = useThemeContext();
  const [appointmentReminders, setAppointmentReminders] = React.useState(true);
  const [medicineReminders, setMedicineReminders] = React.useState(true);
  const [shareReports, setShareReports] = React.useState(false);
  const [biometric, setBiometric] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState(true);
  const [selectedLanguage, setSelectedLanguage] = React.useState('english');
  const [showLanguageModal, setShowLanguageModal] = React.useState(false);
  const [dataAccess, setDataAccess] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(mode);
  const [showDarkModeModal, setShowDarkModeModal] = React.useState(false);
  const [fontSize, setFontSize] = React.useState('default');
  const [showFontSizeModal, setShowFontSizeModal] = React.useState(false);

  const darkModeOptions = [
    { key: 'light', name: 'Light', icon: 'white-balance-sunny' },
    { key: 'dark', name: 'Dark', icon: 'weather-night' },
  ];

  const fontSizeOptions = [
    { key: 'small', name: 'Small', icon: 'format-font-size-decrease' },
    { key: 'default', name: 'Default (Recommended)', icon: 'format-font-size' },
    { key: 'large', name: 'Large', icon: 'format-font-size-increase' },
    { key: 'extra-large', name: 'Extra Large', icon: 'format-size' },
  ];

  const languages = [
    { key: 'english', name: 'English', nativeName: 'English' },
    { key: 'hindi', name: 'Hindi', nativeName: 'हिन्दी' },
    { key: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
    { key: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
    { key: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
    { key: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
    { key: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { key: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { key: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം' },
    { key: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  const settingsSections = [
    {
      title: 'Notification Settings',
      icon: 'bell-outline',
      items: [
        {
          key: 'appointment',
          title: 'Appointment reminders',
          subtitle: 'ON/OFF',
          type: 'switch',
          value: appointmentReminders,
          onToggle: setAppointmentReminders,
        },
        {
          key: 'medicine',
          title: 'Medicine reminders',
          subtitle: 'ON/OFF',
          type: 'switch',
          value: medicineReminders,
          onToggle: setMedicineReminders,
        },
        {
          key: 'notification-type',
          title: 'WhatsApp / SMS / App notification',
          subtitle: 'ON/OFF',
          type: 'switch',
          value: notificationType,
          onToggle: setNotificationType,
        },
      ],
    },
    {
      title: 'Privacy',
      icon: 'lock-outline',
      items: [
        {
          key: 'share-reports',
          title: 'Share reports with doctor',
          subtitle: 'ON/OFF',
          type: 'switch',
          value: shareReports,
          onToggle: setShareReports,
        },
        {
          key: 'data-access',
          title: 'Data access permission',
          subtitle: 'ON/OFF',
          type: 'switch',
          value: dataAccess,
          onToggle: setDataAccess,
        },
      ],
    },
    {
      title: 'Security',
      icon: 'shield-account-outline',
      items: [
        {
          key: 'change-password',
          title: 'Change password',
          subtitle: '',
          type: 'navigation',
          icon: 'chevron-right',
        },
        {
          key: 'login-otp',
          title: 'Login with OTP',
          subtitle: '',
          type: 'navigation',
          icon: 'chevron-right',
        },
        {
          key: 'biometric',
          title: 'Biometric (Fingerprint / Face ID)',
          subtitle: 'ON/OFF',
          type: 'switch',
          value: biometric,
          onToggle: setBiometric,
        },
      ],
    },
    {
      title: 'App Preferences',
      icon: 'cog-outline',
      items: [
        {
          key: 'language',
          title: 'Language',
          subtitle: languages.find(lang => lang.key === selectedLanguage)?.nativeName || 'English',
          type: 'navigation',
          icon: 'chevron-right',
        },
        {
          key: 'dark-mode',
          title: 'Dark mode',
          subtitle: darkModeOptions.find(option => option.key === darkMode)?.name || 'System',
          type: 'navigation',
          icon: 'chevron-right',
        },
        {
          key: 'font-size',
          title: 'Font size',
          subtitle: fontSizeOptions.find(option => option.key === fontSize)?.name || 'Default (Recommended)',
          type: 'navigation',
          icon: 'chevron-right',
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    if (item.type === 'switch') {
      return (
        <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={styles.textContainer}>
            <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor={item.value ? '#FFFFFF' : theme.textSecondary}
            ios_backgroundColor={theme.border}
          />
        </View>
      );
    }

    if (item.key === 'dark-mode') {
      return (
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => setShowDarkModeModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
          <Icon name={item.icon} size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      );
    }

    if (item.key === 'language') {
      return (
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => setShowLanguageModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
          <Icon name={item.icon} size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      );
    }

    if (item.key === 'font-size') {
      return (
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => setShowFontSizeModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
              {item.title}
            </Text>
            <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
              {item.subtitle}
            </Text>
          </View>
          <Icon name={item.icon} size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.settingItem, { backgroundColor: theme.card }]}
        activeOpacity={0.7}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
            {item.title}
          </Text>
          <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
            {item.subtitle}
          </Text>
        </View>
        <Icon name={item.icon} size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    );
  };

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
            Settings
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name={section.icon} size={20} color={theme.textPrimary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                {section.title}
              </Text>
            </View>
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <View key={item.key}>{renderSettingItem(item)}</View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Select Language
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.key}
                  style={[
                    styles.languageOption,
                    selectedLanguage === language.key && styles.selectedLanguageOption,
                    { backgroundColor: selectedLanguage === language.key ? theme.accent + '20' : 'transparent' }
                  ]}
                  onPress={() => {
                    setSelectedLanguage(language.key);
                    setShowLanguageModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageRadio}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: theme.textSecondary }
                    ]}>
                      {selectedLanguage === language.key && (
                        <View style={[
                          styles.radioInner,
                          { backgroundColor: theme.accent }
                        ]} />
                      )}
                    </View>
                  </View>
                  <View style={styles.languageTextContainer}>
                    <Text style={[styles.languageName, { color: theme.textPrimary }]}>
                      {language.name}
                    </Text>
                    <Text style={[styles.languageNativeName, { color: theme.textSecondary }]}>
                      {language.nativeName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Dark Mode Selection Modal */}
      {showDarkModeModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Select Theme
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDarkModeModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.darkModeList}>
              {darkModeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.darkModeOption,
                    darkMode === option.key && styles.selectedDarkModeOption,
                    { backgroundColor: darkMode === option.key ? theme.accent + '20' : 'transparent' }
                  ]}
                  onPress={() => {
                    const newMode = option.key as 'light' | 'dark';
                    setDarkMode(newMode);
                    setMode(newMode);
                    setShowDarkModeModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.darkModeRadio}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: theme.textSecondary }
                    ]}>
                      {darkMode === option.key && (
                        <View style={[
                          styles.radioInner,
                          { backgroundColor: theme.accent }
                        ]} />
                      )}
                    </View>
                  </View>
                  <View style={styles.darkModeTextContainer}>
                    <Icon name={option.icon} size={24} color={theme.textPrimary} />
                    <Text style={[styles.darkModeName, { color: theme.textPrimary }]}>
                      {option.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Font Size Selection Modal */}
      {showFontSizeModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Select Font Size
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFontSizeModal(false)}
              >
                <Icon name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.darkModeList}>
              {fontSizeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.darkModeOption,
                    fontSize === option.key && styles.selectedDarkModeOption,
                    { backgroundColor: fontSize === option.key ? theme.accent + '20' : 'transparent' }
                  ]}
                  onPress={() => {
                    setFontSize(option.key);
                    setShowFontSizeModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.darkModeRadio}>
                    <View style={[
                      styles.radioOuter,
                      { borderColor: theme.textSecondary }
                    ]}>
                      {fontSize === option.key && (
                        <View style={[
                          styles.radioInner,
                          { backgroundColor: theme.accent }
                        ]} />
                      )}
                    </View>
                  </View>
                  <View style={styles.darkModeTextContainer}>
                    <Icon name={option.icon} size={24} color={theme.textPrimary} />
                    <Text style={[styles.darkModeName, { color: theme.textPrimary }]}>
                      {option.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f4efefff',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionItems: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 13,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedLanguageOption: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageRadio: {
    marginRight: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageNativeName: {
    fontSize: 14,
  },
  // Dark mode modal styles
  darkModeList: {
    maxHeight: 300,
  },
  darkModeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedDarkModeOption: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  darkModeRadio: {
    marginRight: 12,
  },
  darkModeTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  darkModeName: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen;
