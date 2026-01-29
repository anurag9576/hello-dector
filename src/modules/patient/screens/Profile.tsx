import React, { useMemo, useState } from 'react';
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
import {
  patientMeta,
  profileSections,
  ProfileSection,
  ProfileListItem,
} from './user_profile_data';

type ProfileProps = {
  theme: ThemePalette;
  onBack: () => void;
};

const Profile: React.FC<ProfileProps> = ({ theme, onBack }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sectionsData, setSectionsData] = useState(profileSections);
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

  const handleEditSave = () => {
    if (!editingKey) {
      return;
    }
    const [sectionKey, label] = editingKey.split('::');
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

  const saveSectionEdit = () => {
    if (!editingSectionKey) {
      return;
    }
    setSectionsData(prev =>
      prev.map(section =>
        section.key === editingSectionKey
          ? {
              ...section,
              items: section.items.map(item => {
                const rowKey = `${section.key}::${item.label}`;
                return {
                  ...item,
                  value: sectionDrafts[rowKey] ?? item.value,
                };
              }),
            }
          : section,
      ),
    );
    cancelSectionEdit();
  };

  const handleDraftChange = (rowKey: string, value: string) =>
    setSectionDrafts(prev => ({
      ...prev,
      [rowKey]: value,
    }));

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
              { icon: 'map-marker', label: 'City', value: `${patientMeta.city}, ${patientMeta.state}` },
            ].map(item => (
              <View key={item.label} style={styles.metaCell}>
                <Icon name={item.icon} size={18} color={theme.textSecondary} />
                <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                  {item.label}
                </Text>
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
]);

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
                {item.value}
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
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.015)',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    opacity: 0.6,
    marginTop: 4,
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
