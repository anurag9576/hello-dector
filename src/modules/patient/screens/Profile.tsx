import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { apiCall } from '../../../utils/api';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { ThemePalette } from '../../../theme/palette';
import { usePatientProfile, PatientMeta } from '../hooks/usePatientProfile';
import { getUserSession } from '../../../utils/storage';
import { updatePatientProfile } from '../../../utils/api';

export type ProfileListItem = {
  label: string;
  value: string;
  helper?: string;
  chip?: string;
};

export type ProfileSection = {
  key: string;
  title: string;
  icon: string;
  accent: string;
  items: ProfileListItem[];
  allowsSectionEdit?: boolean;
  sectionIcon?: string;
};

// Default empty sections structure
// Default sections structure with labels
const initialSections: ProfileSection[] = [
  {
    key: 'basic',
    title: 'Basic Information',
    icon: 'account-badge',
    accent: '#1B998B',
    allowsSectionEdit: true,
    items: [
      { label: 'Full Name', value: '' },
      { label: 'Gender', value: '' },
      { label: 'Date of Birth', value: '' },
      { label: 'Mobile', value: '' },
      { label: 'Email', value: '' },
      { label: 'Address', value: '' },
    ],
  },
  {
    key: 'emergency',
    title: 'Emergency Contact',
    icon: 'phone-alert',
    accent: '#D97706',
    allowsSectionEdit: true,
    items: [
      { label: 'Name', value: '' },
      { label: 'Relationship', value: '' },
      { label: 'Contact Number', value: '' },
    ],
  },
  {
    key: 'medical',
    title: 'Medical Information',
    icon: 'heart-pulse',
    accent: '#EF476F',
    allowsSectionEdit: true,
    items: [
      { label: 'Blood Group', value: '' },
      { label: 'Height', value: '' },
      { label: 'Weight', value: '' },
      { label: 'Existing Conditions', value: '' },
      { label: 'Allergies', value: '' },
      { label: 'Past Surgeries', value: '' },
    ],
  },
  {
    key: 'current',
    title: 'Current Health Details',
    icon: 'clipboard-pulse-outline',
    accent: '#6366F1',
    allowsSectionEdit: true,
    items: [
      { label: 'Symptoms', value: '' },
      { label: 'Medications', value: '' },
      { label: 'Doctor', value: '' },
    ],
  },
  {
    key: 'lifestyle',
    title: 'Lifestyle',
    icon: 'leaf',
    accent: '#0EA5E9',
    allowsSectionEdit: true,
    items: [
      { label: 'Smoking', value: '' },
      { label: 'Alcohol', value: '' },
      { label: 'Exercise', value: '' },
      { label: 'Diet', value: '' },
    ],
  },
  {
    key: 'insurance',
    title: 'Insurance & Hospital',
    icon: 'shield-check',
    accent: '#16A34A',
    allowsSectionEdit: true,
    items: [
      { label: 'Health Insurance', value: '' },
      { label: 'Provider', value: '' },
      { label: 'Policy Number', value: '' },
      { label: 'Preferred Hospital', value: '' },
    ],
  },
];

type ProfileProps = {
  theme: ThemePalette;
  onBack: () => void;
};

const Profile: React.FC<ProfileProps> = ({ theme, onBack }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { patientMeta, fullProfile, loading: profileLoading } = usePatientProfile();
  const [sectionsData, setSectionsData] = useState<ProfileSection[]>(initialSections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileLoading && patientMeta) {
      // Re-generate segments based on fetched meta and full profile
      const updatedSections = initialSections.map(section => {
        if (section.key === 'basic') {
          return {
            ...section,
            items: [
              { label: 'Full Name', value: patientMeta.fullName },
              { label: 'Gender', value: patientMeta.gender },
              { label: 'Date of Birth', value: patientMeta.dob, helper: patientMeta.age ? `Age ${patientMeta.age}` : '' },
              { label: 'Mobile', value: patientMeta.contact },
              { label: 'Email', value: patientMeta.email },
              { label: 'Address', value: fullProfile?.basicInfo?.address || (patientMeta.city ? `${patientMeta.city}, ${patientMeta.state}` : '') },
            ],
          };
        }
        if (section.key === 'emergency' && fullProfile?.emergencyContact) {
          return {
            ...section,
            items: [
              { label: 'Name', value: fullProfile.emergencyContact.name || '' },
              { label: 'Relationship', value: fullProfile.emergencyContact.relationship || '' },
              { label: 'Contact Number', value: fullProfile.emergencyContact.phone || '' },
            ],
          };
        }
        if (section.key === 'medical' && fullProfile?.medicalInfo) {
          return {
            ...section,
            items: [
              { label: 'Blood Group', value: fullProfile.medicalInfo.bloodGroup || '' },
              { label: 'Height', value: fullProfile.medicalInfo.height || '' },
              { label: 'Weight', value: fullProfile.medicalInfo.weight || '' },
              { label: 'Existing Conditions', value: fullProfile.medicalInfo.existingConditions || '' },
              { label: 'Allergies', value: fullProfile.medicalInfo.allergies || '' },
              { label: 'Past Surgeries', value: fullProfile.medicalInfo.pastSurgeries || '' },
            ],
          };
        }
        if (section.key === 'current' && fullProfile?.currentHealth) {
          return {
            ...section,
            items: [
              { label: 'Symptoms', value: fullProfile.currentHealth.symptoms || '' },
              { label: 'Medications', value: fullProfile.currentHealth.medications || '' },
              { label: 'Doctor', value: fullProfile.currentHealth.assignedDoctor || '' },
            ],
          };
        }
        if (section.key === 'lifestyle' && fullProfile?.lifestyle) {
          return {
            ...section,
            items: [
              { label: 'Smoking', value: fullProfile.lifestyle.smoking || '' },
              { label: 'Alcohol', value: fullProfile.lifestyle.alcohol || '' },
              { label: 'Exercise', value: fullProfile.lifestyle.exercise || '' },
              { label: 'Diet', value: fullProfile.lifestyle.diet || '' },
            ],
          };
        }
        if (section.key === 'insurance' && fullProfile?.insurance) {
          return {
            ...section,
            items: [
              { label: 'Health Insurance', value: fullProfile.insurance.hasInsurance ? 'Yes' : 'No' },
              { label: 'Provider', value: fullProfile.insurance.provider || '' },
              { label: 'Policy Number', value: fullProfile.insurance.policyNumber || '' },
              { label: 'Preferred Hospital', value: fullProfile.insurance.preferredHospital || '' },
            ],
          };
        }
        return section;
      });
      setSectionsData(updatedSections);
      setLoading(false);
    }
  }, [profileLoading, patientMeta, fullProfile]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null);
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, string>>({});

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setIsScrolled(offsetY > 4);
  };

  const handleEditStart = (sectionKey: string, label: string, currentValue: string) => {
    setEditingKey(`${sectionKey}::${label}`);
    setEditingValue(currentValue);
  };

  const handleEditCancel = () => {
    setEditingKey(null);
    setEditingValue('');
  };

  const handleEditSave = async () => {
    if (!editingKey) {
      return;
    }
    const [sectionKey, label] = editingKey.split('::');

    // Construct backend payload based on field
    let payload: any = {};
    if (sectionKey === 'basic') {
      const fieldMap: Record<string, string> = {
        'Full Name': 'fullName',
        'Gender': 'gender',
        'Date of Birth': 'dob',
        'Mobile': 'phone',
        'Email': 'email',
        'Address': 'address',
      };
      const dbField = fieldMap[label];
      if (dbField) {
        payload.basicInfo = { [dbField]: editingValue };
      }
    } else if (sectionKey === 'emergency') {
      const fieldMap: Record<string, string> = {
        'Name': 'name',
        'Relationship': 'relationship',
        'Contact Number': 'phone',
      };
      payload.emergencyContact = { [fieldMap[label]]: editingValue };
    } else if (sectionKey === 'medical') {
      const fieldMap: Record<string, string> = {
        'Blood Group': 'bloodGroup',
        'Height': 'height',
        'Weight': 'weight',
        'Existing Conditions': 'existingConditions',
        'Allergies': 'allergies',
        'Past Surgeries': 'pastSurgeries',
      };
      payload.medicalInfo = { [fieldMap[label]]: editingValue };
    }

    try {
      setLoading(true);
      const session = await getUserSession();
      const userId = session?.user?.id || session?.id || session?.userId;
      
      await updatePatientProfile({ userId, ...payload });

      setSectionsData(prev =>
        prev.map(section =>
          section.key === sectionKey
            ? {
                ...section,
                items: section.items.map(item =>
                  item.label === label ? { ...item, value: editingValue } : item,
                ),
              }
            : section,
        ),
      );
      handleEditCancel();
    } catch (err: any) {
      console.error('Failed to save field:', err);
    } finally {
      setLoading(false);
    }
  };

  const startSectionEdit = (section: ProfileSection) => {
    const draft: Record<string, string> = {};
    section.items.forEach(item => {
      draft[`${section.key}::${item.label}`] = item.value;
    });
    setSectionDrafts(draft);
    setEditingSectionKey(section.key);
    setEditingKey(null);
  };

  const cancelSectionEdit = () => {
    setSectionDrafts({});
    setEditingSectionKey(null);
  };

  const saveSectionEdit = async () => {
    if (!editingSectionKey) {
      return;
    }

    const updatedItems = sectionsData
      .find(s => s.key === editingSectionKey)
      ?.items.map(item => {
        const rowKey = `${editingSectionKey}::${item.label}`;
        return {
          ...item,
          value: sectionDrafts[rowKey] ?? item.value,
        };
      }) || [];

    const updatedValues: Record<string, string> = {};
    updatedItems.forEach(it => {
      updatedValues[it.label] = it.value;
    });

    let payload: any = {};
    if (editingSectionKey === 'basic') {
      payload.basicInfo = {
        fullName: updatedValues['Full Name'],
        gender: updatedValues['Gender'],
        dob: updatedValues['Date of Birth'],
        phone: updatedValues['Mobile'],
        email: updatedValues['Email'],
        address: updatedValues['Address'],
      };
    } else if (editingSectionKey === 'emergency') {
      payload.emergencyContact = {
        name: updatedValues['Name'],
        relationship: updatedValues['Relationship'],
        phone: updatedValues['Contact Number'],
      };
    } else if (editingSectionKey === 'medical') {
      payload.medicalInfo = {
        bloodGroup: updatedValues['Blood Group'],
        height: updatedValues['Height'],
        weight: updatedValues['Weight'],
        existingConditions: updatedValues['Existing Conditions'],
        allergies: updatedValues['Allergies'],
        pastSurgeries: updatedValues['Past Surgeries'],
      };
    } else if (editingSectionKey === 'current') {
      payload.currentHealth = {
        symptoms: updatedValues['Symptoms'],
        medications: updatedValues['Medications'],
        assignedDoctor: updatedValues['Doctor'],
      };
    } else if (editingSectionKey === 'lifestyle') {
      payload.lifestyle = {
        smoking: updatedValues['Smoking'],
        alcohol: updatedValues['Alcohol'],
        exercise: updatedValues['Exercise'],
        diet: updatedValues['Diet'],
      };
    } else if (editingSectionKey === 'insurance') {
      payload.insurance = {
        hasInsurance: updatedValues['Health Insurance'] === 'Yes',
        provider: updatedValues['Provider'],
        policyNumber: updatedValues['Policy Number'],
        preferredHospital: updatedValues['Preferred Hospital'],
      };
    }

    try {
      setLoading(true);
      const session = await getUserSession();
      const userId = session?.user?.id || session?.id || session?.userId;
      
      await updatePatientProfile({ userId, ...payload });

      setSectionsData(prev =>
        prev.map(section =>
          section.key === editingSectionKey
            ? { ...section, items: updatedItems }
            : section,
        ),
      );
      cancelSectionEdit();
    } catch (err: any) {
      console.error('Failed to save section:', err);
      // Removed Alert import to avoid more lint errors, using console and local error handle
    } finally {
      setLoading(false);
    }
  };

  const handleDraftChange = (rowKey: string, value: string) =>
    setSectionDrafts(prev => ({
      ...prev,
      [rowKey]: value,
    }));

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingCenter, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textSecondary }}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.navBar,
          {
            backgroundColor: theme.card,
            borderBottomWidth: isScrolled ? 1 : 0,
            borderColor: 'rgba(0,0,0,0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isScrolled ? 0.05 : 0,
            shadowRadius: 12,
            elevation: isScrolled ? 4 : 0,
          },
        ]}
      >
        <View style={styles.navLeft}>
          <TouchableOpacity style={styles.navButton} onPress={onBack} activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>My Profile</Text>
        </View>
        <View style={styles.navButtonPlaceholder} />
      </View>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={[styles.heroCard, { backgroundColor: theme.card }]}>
          <View style={styles.heroTop}>
            <View
              style={[
                styles.heroAvatar,
                { backgroundColor: theme.accent + '1A' },
              ]}
            >
              <Text style={[styles.heroInitials, { color: theme.accent }]}>
                {patientMeta.initials}
              </Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={[styles.heroName, { color: theme.textPrimary }]}>
                {patientMeta.fullName}
              </Text>
              <View style={styles.heroIdRow}>
                <Text style={[styles.heroTier, { color: theme.textSecondary }]}>
                  Patient ID:
                </Text>
                <View style={[styles.idChip, { backgroundColor: theme.accent }]}>
                  <Icon name="shield-check" size={14} color="#fff" />
                  <Text style={styles.idChipLabel}>{patientMeta.patientId}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.heroMetaGrid}>
            {[
              { icon: 'calendar-star', label: 'Member since', value: patientMeta.memberSince },
              { icon: 'account', label: 'Gender', value: patientMeta.gender },
              { icon: 'cake-variant', label: 'Age', value: `${patientMeta.age} yrs` },
              { icon: 'map-marker', label: 'City', value: (fullProfile?.basicInfo?.address?.trim().split(/[\s,]+/)[0]) || patientMeta.city || 'N/A' },
            ].map(item => (
              <View key={item.label} style={styles.metaCell}>
                <View style={styles.metaHeader}>
                  <Icon name={item.icon} size={14} color={theme.textSecondary} />
                  <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.metaValue, { color: theme.textPrimary }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {sectionsData.map(section => (
          <ProfileSectionCard
            key={section.key}
            section={section}
            theme={theme}
            editingKey={editingKey}
            editingValue={editingValue}
            onChangeValue={setEditingValue}
            onStartEdit={handleEditStart}
            onCancelEdit={handleEditCancel}
            onSaveEdit={handleEditSave}
            editingSectionKey={editingSectionKey}
            drafts={sectionDrafts}
            onDraftChange={handleDraftChange}
            onSectionEditStart={startSectionEdit}
            onSectionEditCancel={cancelSectionEdit}
            onSectionEditSave={saveSectionEdit}
          />
        ))}
      </ScrollView>
    </View>
  );
};

type SectionCardProps = {
  section: ProfileSection;
  theme: ThemePalette;
  editingKey: string | null;
  editingValue: string;
  onChangeValue: (value: string) => void;
  onStartEdit: (sectionKey: string, label: string, currentValue: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  editingSectionKey: string | null;
  drafts: Record<string, string>;
  onDraftChange: (rowKey: string, value: string) => void;
  onSectionEditStart: (section: ProfileSection) => void;
  onSectionEditCancel: () => void;
  onSectionEditSave: () => void;
};

const ProfileSectionCard: React.FC<SectionCardProps> = ({
  section,
  theme,
  editingKey,
  editingValue,
  onChangeValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  editingSectionKey,
  drafts,
  onDraftChange,
  onSectionEditStart,
  onSectionEditCancel,
  onSectionEditSave,
}) => {
  const accentBg = useMemo(() => `${section.accent}14`, [section.accent]);
  const isSectionEditable = !!section.allowsSectionEdit;
  const isSectionEditing = isSectionEditable && editingSectionKey === section.key;

  return (
    <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconWrap, { backgroundColor: accentBg }]}>
          <Icon name={section.icon} size={20} color={section.accent} />
        </View>
        <View style={styles.sectionHeaderText}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {section.title}
          </Text>
          {section.sectionIcon && (
            <View style={[styles.sectionBadge, { backgroundColor: accentBg }]}>
              <Icon name={section.sectionIcon} size={16} color={section.accent} />
            </View>
          )}
        </View>
        {isSectionEditable && !isSectionEditing && (
          <TouchableOpacity
            style={styles.sectionEditBtn}
            onPress={() => onSectionEditStart(section)}
            activeOpacity={0.7}
          >
            <Icon name="pencil" size={18} color={section.accent} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sectionBody}>
        {section.items.map(item => (
          <ProfileRow
            key={item.label}
            item={item}
            sectionKey={section.key}
            theme={theme}
            accent={section.accent}
            editingKey={editingKey}
            editingValue={editingValue}
            onChangeValue={onChangeValue}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            isSectionEditing={isSectionEditing}
            drafts={drafts}
            onDraftChange={onDraftChange}
            isSectionEditable={isSectionEditable}
          />
        ))}
      </View>
      {isSectionEditing && (
        <View style={styles.sectionActions}>
          <TouchableOpacity
            style={[styles.sectionActionBtn, styles.sectionActionSave]}
            onPress={onSectionEditSave}
            activeOpacity={0.85}
          >
            <Icon name="content-save" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sectionActionBtn, styles.sectionActionCancel]}
            onPress={onSectionEditCancel}
            activeOpacity={0.85}
          >
            <Icon name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

type RowProps = {
  item: ProfileListItem;
  sectionKey: string;
  theme: ThemePalette;
  accent: string;
  editingKey: string | null;
  editingValue: string;
  onChangeValue: (value: string) => void;
  onStartEdit: (sectionKey: string, label: string, currentValue: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  isSectionEditing: boolean;
  drafts: Record<string, string>;
  onDraftChange: (rowKey: string, value: string) => void;
  isSectionEditable: boolean;
};

const inlineLockedFields = new Set([
  'Full Name',
  'Gender',
  'Date of Birth',
  'Mobile',
  'Email',
  'Address',
  'City',
  'State',
]);

const labelSuffixes: Record<string, string> = {
  'Height': 'cm',
  'Weight': 'kg',
};

const ProfileRow: React.FC<RowProps> = ({
  item,
  sectionKey,
  theme,
  accent,
  editingKey,
  editingValue,
  onChangeValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  isSectionEditing,
  drafts,
  onDraftChange,
  isSectionEditable,
}) => {
  const rowKey = `${sectionKey}::${item.label}`;
  const isEditing = editingKey === rowKey;
  const isBulkMode = isSectionEditing;
  const draftValue = drafts[rowKey] ?? item.value;
  const isAddressField = item.label.toLowerCase().includes('address');
  const isEmailField = item.label.toLowerCase().includes('email');
  const isPhoneField =
    item.label.toLowerCase().includes('mobile') || item.label.toLowerCase().includes('contact');
  const isDobField = item.label === 'Date of Birth';
  const isGenderField = item.label === 'Gender';

  const keyboardType = isEmailField ? 'email-address' : isPhoneField ? 'phone-pad' : 'default';
  const [isGenderMenuOpen, setIsGenderMenuOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [iosPickerDate, setIosPickerDate] = useState<Date>(new Date());

  const parseDraftDate = () => {
    if (!draftValue) {
      return new Date();
    }
    const [day, month, year] = draftValue.split('/').map(Number);
    const parsed = new Date((year ?? 1900), (month ?? 1) - 1, day ?? 1);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const handleDateConfirm = (date: Date) => {
    const formatted = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
    onDraftChange(rowKey, formatted);
    setIsDatePickerVisible(false);
  };

  const openDatePicker = () => {
    const initialDate = parseDraftDate();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialDate,
        maximumDate: new Date(),
        mode: 'date',
        onChange: (_, selectedDate) => {
          if (selectedDate) {
            handleDateConfirm(selectedDate);
          }
        },
      });
    } else {
      setIosPickerDate(initialDate);
      setIsDatePickerVisible(true);
    }
  };

  const canShowRowEdit = !isSectionEditable && !inlineLockedFields.has(item.label);

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
          {item.label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {isBulkMode ? (
          <View style={styles.editWrap}>
            {isDobField ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.dropdownTrigger,
                    {
                      borderColor: accent,
                      backgroundColor: 'transparent',
                    },
                  ]}
                  onPress={openDatePicker}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.dropdownValue, { color: theme.textPrimary }]}>
                    {draftValue || 'Select date'}
                  </Text>
                  <Icon name="calendar" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
                {Platform.OS === 'ios' && isDatePickerVisible && (
                  <Modal
                    visible={isDatePickerVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setIsDatePickerVisible(false)}
                  >
                    <Pressable
                      style={styles.modalOverlay}
                      onPress={() => setIsDatePickerVisible(false)}
                    >
                      <View style={[styles.dateModalSheet, { backgroundColor: theme.card }]}>
                        <DateTimePicker
                          value={iosPickerDate}
                          mode="date"
                          maximumDate={new Date()}
                          display="spinner"
                          onChange={(_, selectedDate) => {
                            if (selectedDate) {
                              setIosPickerDate(selectedDate);
                            }
                          }}
                          textColor={theme.textPrimary}
                        />
                        <View style={styles.dateModalActions}>
                          <TouchableOpacity
                            style={[styles.dateModalBtn, styles.dateModalCancel]}
                            onPress={() => setIsDatePickerVisible(false)}
                          >
                            <Text style={styles.dateModalBtnText}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.dateModalBtn, styles.dateModalConfirm]}
                            onPress={() => handleDateConfirm(iosPickerDate)}
                          >
                            <Text style={[styles.dateModalBtnText, { color: '#fff' }]}>
                              Set Date
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Pressable>
                  </Modal>
                )}
              </>
            ) : isGenderField ? (
              <>
                <TouchableOpacity
                  style={[
                    styles.dropdownTrigger,
                    { borderColor: accent, backgroundColor: 'transparent' },
                  ]}
                  onPress={() => setIsGenderMenuOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dropdownValue, { color: theme.textPrimary }]}>
                    {draftValue}
                  </Text>
                  <Icon name="chevron-down" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
                <Modal
                  visible={isGenderMenuOpen}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setIsGenderMenuOpen(false)}
                >
                  <Pressable style={styles.modalOverlay} onPress={() => setIsGenderMenuOpen(false)}>
                    <View style={[styles.modalSheet, { backgroundColor: theme.card }]}>
                      {['Female', 'Male', 'Other'].map(option => (
                        <TouchableOpacity
                          key={option}
                          style={styles.modalOption}
                          onPress={() => {
                            onDraftChange(rowKey, option);
                            setIsGenderMenuOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.modalOptionText,
                              {
                                color: option === draftValue ? accent : theme.textPrimary,
                                fontWeight: option === draftValue ? '700' : '500',
                              },
                            ]}
                          >
                            {option}
                          </Text>
                          {option === draftValue && <Icon name="check" size={16} color={accent} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Pressable>
                </Modal>
              </>
            ) : (
              <TextInput
                value={draftValue}
                onChangeText={text => onDraftChange(rowKey, text)}
                style={[
                  styles.rowInput,
                  {
                    borderColor: accent,
                    color: theme.textPrimary,
                    minHeight: isAddressField ? 70 : undefined,
                  },
                ]}
                multiline={isAddressField}
                keyboardType={keyboardType}
                placeholder={item.label}
                placeholderTextColor={theme.textSecondary}
              />
            )}
            {item.helper && (
              <Text style={[styles.rowHelper, { color: theme.textSecondary }]}>
                {item.helper}
              </Text>
            )}
          </View>
        ) : isEditing ? (
          <View style={styles.editWrap}>
            <TextInput
              value={editingValue}
              onChangeText={onChangeValue}
              autoFocus
              style={[
                styles.rowInput,
                { borderColor: accent, color: theme.textPrimary },
              ]}
              placeholder="Enter value"
              placeholderTextColor={theme.textSecondary}
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={onSaveEdit}
                style={[styles.editActionBtn, { backgroundColor: accent }]}
                activeOpacity={0.8}
              >
                <Icon name="check" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onCancelEdit}
                style={styles.editActionBtn}
                activeOpacity={0.8}
              >
                <Icon name="close" size={16} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.valueRow}>
              <Text style={[styles.rowValue, { color: theme.textPrimary }]}>
                {item.value ? `${item.value}${labelSuffixes[item.label] ? ` ${labelSuffixes[item.label]}` : ''}` : '—'}
              </Text>
              {canShowRowEdit && (
                <TouchableOpacity
                  style={styles.editIconBtn}
                  onPress={() => onStartEdit(sectionKey, item.label, item.value)}
                  activeOpacity={0.7}
                >
                  <Icon name="pencil" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            {item.chip && (
              <View style={[styles.rowChip, { backgroundColor: accent + '1F' }]}>
                <Text style={[styles.rowChipText, { color: accent }]}>
                  {item.chip}
                </Text>
              </View>
            )}
            {item.helper && (
              <Text style={[styles.rowHelper, { color: theme.textSecondary }]}>
                {item.helper}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    zIndex: 100,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  navButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  heroCard: {
    borderRadius: 32,
    padding: 24,
    gap: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 12,
  },
  heroAvatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  heroInitials: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroCopy: {
    alignItems: 'center',
    gap: 8,
  },
  heroName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 34,
  },
  heroIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  heroTier: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  idChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  idChipLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  heroMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaCell: {
    width: '48%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    borderColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'rgba(0,0,0,0.015)',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    opacity: 0.5,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 24,
    gap: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
  },
  sectionHeaderText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sectionBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  sectionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionBody: {
    gap: 20,
  },
  row: {
    flexDirection: 'column',
    gap: 6,
    paddingVertical: 4,
  },
  rowLeft: {
    width: '100%',
    marginBottom: 2,
  },
  rowLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  rowRight: {
    flex: 1,
    gap: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 28,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  editIconBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  rowHelper: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.7,
  },
  rowChip: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 2,
  },
  rowChipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editWrap: {
    gap: 12,
  },
  rowInput: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  editActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionEditBtn: {
    marginLeft: 'auto',
    borderRadius: 14,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  sectionActions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 20,
  },
  sectionActionBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionActionSave: {
    backgroundColor: '#22C55E',
  },
  sectionActionCancel: {
    backgroundColor: '#EF4444',
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  dropdownValue: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalSheet: {
    width: '100%',
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  modalOptionText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  dateModalSheet: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  dateModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  dateModalBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dateModalCancel: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  dateModalConfirm: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  dateModalBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
});

export default Profile;
