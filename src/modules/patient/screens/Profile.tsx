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
            shadowColor: '#000',
            borderColor: theme.border,
            borderBottomWidth: isScrolled ? StyleSheet.hairlineWidth : 0,
            shadowOpacity: isScrolled ? 0.08 : 0,
            elevation: isScrolled ? 3 : 0,
          },
        ]}
      >
        <View style={styles.navLeft}>
          <TouchableOpacity style={styles.navButton} onPress={onBack} activeOpacity={0.7}>
            <Icon name="arrow-left" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.textPrimary }]}>Profile</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  navButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 32,
    gap: 20,
  },
  heroCard: {
    borderRadius: 32,
    padding: 28,
    gap: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroAvatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  heroInitials: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
    lineHeight: 32,
  },
  heroTier: {
    fontSize: 14,
  },
  heroIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idChip: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  idChipLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  heroMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaCell: {
    width: '47%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    borderColor: 'rgba(0,0,0,0.06)',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  metaLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 24,
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionHeaderText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sectionBody: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 18,
    paddingVertical: 4,
  },
  rowLeft: {
    width: 110,
  },
  rowLabel: {
    fontSize: 14,
    letterSpacing: 0.4,
    fontWeight: '500',
  },
  rowRight: {
    flex: 1,
    gap: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  editIconBtn: {
    padding: 6,
    borderRadius: 999,
  },
  rowHelper: {
    fontSize: 13,
  },
  rowChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: -2,
  },
  rowChipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  editWrap: {
    gap: 8,
  },
  rowInput: {
    borderWidth: 1.6,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
  },
  sectionEditBtn: {
    marginLeft: 'auto',
    borderRadius: 14,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sectionActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  sectionActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionActionSave: {
    backgroundColor: '#22C55E',
  },
  sectionActionCancel: {
    backgroundColor: '#EF4444',
  },
  dropdownTrigger: {
    borderWidth: 1.6,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dropdownValue: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalSheet: {
    width: '100%',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 6,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  dateModalSheet: {
    width: '100%',
    borderRadius: 28,
    padding: 20,
    gap: 20,
  },
  dateModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dateModalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  dateModalCancel: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  dateModalConfirm: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dateModalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: 0.1,
  },
});

export default Profile;
