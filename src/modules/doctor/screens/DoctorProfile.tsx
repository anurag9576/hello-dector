import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Switch,
  Alert,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { ThemePalette } from '../../../theme/palette';
import { getDoctorProfile, saveDoctorProfile, updateDoctorProfile } from '../../../utils/api';
import { getUserSession } from '../../../utils/storage';

Icon.loadFont();

type DoctorProfileProps = {
  theme: ThemePalette;
  onLogout: () => void;
  onBack?: () => void;
};

type ProfileSectionItem = {
  label: string;
  icon: string;
  value?: string;
  type?: 'link' | 'toggle';
  color?: string;
  onPress?: () => void;
};

const DoctorProfile: React.FC<DoctorProfileProps> = ({ theme, onLogout, onBack }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDegreePicker, setShowDegreePicker] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    specialty: '',
    experience: '',
    degree: '',
    clinic: '',
    about: '',
    languages: '',
    onlineFees: '',
    clinicFees: '',
    services: '',
    phone: '',
    profileImage: '',
  });
  const [editForm, setEditForm] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const session = await getUserSession();
      const uid = session?.userId || session?.user?.id || session?.data?._id || session?.data?.id || session?._id || session?.id;
      if (uid) setUserId(uid);
      
      const res = await getDoctorProfile();
      if (res && (res.data || res.profile)) {
        const data = res.data || res.profile;
        const mappedProfile = {
          name: data.basicInfo?.name || '',
          specialty: data.basicInfo?.specialty || '',
          experience: data.basicInfo?.experience || '',
          degree: data.basicInfo?.degree || '',
          clinic: data.basicInfo?.clinic || '',
          about: data.patientCentricDetails?.about || '',
          languages: data.patientCentricDetails?.languages || '',
          onlineFees: data.consultationFees?.online || '',
          clinicFees: data.consultationFees?.clinic || '',
          services: Array.isArray(data.patientCentricDetails?.services) 
            ? data.patientCentricDetails.services.join(', ') 
            : '',
          phone: data.userId?.phone || '',
          profileImage: data.basicInfo?.profileImage || '',
        };
        setProfile(mappedProfile);
        setEditForm(mappedProfile);
        setIsOnline(data.currentStatus?.isAcceptingNewPatients ?? true);
        setNotificationsEnabled(data.currentStatus?.notificationsEnabled ?? true);
      }
    } catch (error) {
      console.log('Profile fetch note:', error);
    } finally {
      setLoading(false);
    }
  };

  const medicalDegrees = [
    'MBBS', 'MD', 'MS', 'BDS', 'MDS', 'BAMS', 'BHMS', 'BUMS', 'DNB', 'PhD', 'MCh', 'DM', 'FRCP', 'FRCS', 'Diploma'
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: onLogout },
    ]);
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setEditForm(prev => ({ ...prev, profileImage: uri }));
        }
      }
    });
  };

  const handleSave = async () => {
    let currentUserId = userId;
    if (!currentUserId) {
      const session = await getUserSession();
      currentUserId = session?.userId || session?.user?.id || session?.data?._id || session?.data?.id || session?._id || session?.id;
      if (!currentUserId) {
        Alert.alert('Error', 'Please login again to update profile');
        return;
      }
      setUserId(currentUserId);
    }

    setLoading(true);
    try {
      const payload = {
        userId: currentUserId,
        basicInfo: {
          name: editForm.name,
          specialty: editForm.specialty,
          experience: editForm.experience,
          degree: editForm.degree,
          clinic: editForm.clinic,
          profileImage: editForm.profileImage,
          phone: editForm.phone
        },
        patientCentricDetails: {
          about: editForm.about,
          languages: editForm.languages,
          services: editForm.services.split(',').map(s => s.trim())
        },
        consultationFees: {
          online: editForm.onlineFees,
          clinic: editForm.clinicFees
        },
        publicStats: {
          totalPatients: '12k+',
          averageRating: 4.9,
          totalReviews: '2.5k'
        },
        currentStatus: {
          isAcceptingNewPatients: isOnline,
          notificationsEnabled: notificationsEnabled,
          isVerified: true
        }
      };

      const response = await updateDoctorProfile(payload);
      const updatedData = response.profile || response.data || editForm;
      
      const updatedProfile = {
        name: updatedData.basicInfo?.name || editForm.name,
        specialty: updatedData.basicInfo?.specialty || editForm.specialty,
        experience: updatedData.basicInfo?.experience || editForm.experience,
        degree: updatedData.basicInfo?.degree || editForm.degree,
        clinic: updatedData.basicInfo?.clinic || editForm.clinic,
        about: updatedData.patientCentricDetails?.about || editForm.about,
        languages: updatedData.patientCentricDetails?.languages || editForm.languages,
        onlineFees: updatedData.consultationFees?.online || editForm.onlineFees,
        clinicFees: updatedData.consultationFees?.clinic || editForm.clinicFees,
        services: Array.isArray(updatedData.patientCentricDetails?.services) 
          ? updatedData.patientCentricDetails.services.join(', ') 
          : editForm.services,
        phone: updatedData.userId?.phone || updatedData.basicInfo?.phone || editForm.phone,
        profileImage: updatedData.basicInfo?.profileImage || editForm.profileImage,
      };

      setProfile(updatedProfile);
      setEditForm(updatedProfile);
      setShowEditModal(false);
      setTimeout(() => {
        Alert.alert('Success', 'Profile updated successfully');
      }, 500);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const updateStatus = async (type: 'online' | 'notifications', value: boolean) => {
    if (!userId) return;
    try {
      const payload = {
        userId: userId,
        currentStatus: {
          isAcceptingNewPatients: type === 'online' ? value : isOnline,
          notificationsEnabled: type === 'notifications' ? value : notificationsEnabled,
        }
      };
      await saveDoctorProfile(payload);
    } catch (error) {
      console.log('Status update note:', error);
    }
  };

  const menuItems: { title: string; items: ProfileSectionItem[] }[] = [
    {
      title: 'Practice Management',
      items: [
        { label: 'Manage Schedule', icon: 'calendar-clock', type: 'link', color: '#4F46E5' },
        { label: 'Clinic Details', icon: 'hospital-building', value: profile.clinic, type: 'link', color: '#10B981' },
        { label: 'Consultation Fees', icon: 'cash', value: `Online: ₹${profile.onlineFees} • Clinic: ₹${profile.clinicFees}`, type: 'link', color: '#F59E0B' },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { label: 'Accepting New Patients', icon: 'account-check', type: 'toggle', color: '#8B5CF6' },
        { label: 'Notifications', icon: 'bell-outline', type: 'toggle', color: '#EC4899' },
        { label: 'Documents & License', icon: 'file-certificate-outline', type: 'link', color: '#64748B' },
        { label: 'Security & Password', icon: 'lock-outline', type: 'link', color: '#64748B' },
      ],
    },
    {
      title: 'Support & Legal',
      items: [
        { label: 'Help & Support', icon: 'lifebuoy', type: 'link', color: '#64748B' },
        { label: 'Terms & Privacy', icon: 'shield-check-outline', type: 'link', color: '#64748B' },
        { label: 'Share Profile', icon: 'share-variant-outline', type: 'link', color: '#64748B' },
        { label: 'Give Feedback', icon: 'message-draw', type: 'link', color: '#64748B' },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Top Navigation Bar */}
      <View style={[styles.navHeader, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity 
           style={styles.navBackBtn} 
           onPress={onBack}
           activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: theme.textPrimary }]}>Doctor Profile</Text>
      </View>

      {loading && (
        <View style={styles.loaderOverlay}>
           <View style={[styles.loaderContent, { backgroundColor: theme.card }]}>
              <ActivityIndicator size="large" color={theme.accent} />
              <Text style={[styles.loaderText, { color: theme.textPrimary }]}>Updating Profile...</Text>
           </View>
        </View>
      )}

      <ScrollView 
          contentContainerStyle={styles.container} 
          showsVerticalScrollIndicator={false}
      >
        {/* Modern Profile Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={handleSelectImage}>
                {profile.profileImage && profile.profileImage.trim() !== '' ? (
                   <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
                ) : (
                   <Image 
                      source={require('../../../screens/image/logo.png')} 
                      style={[styles.avatar, { backgroundColor: '#FFF' }]} 
                   />
                )}
               <View style={[styles.onlineBadge, { backgroundColor: isOnline ? '#10B981' : '#64748B' }]} />
               <View style={styles.editImageBadge}>
                  <Icon name="camera" size={12} color="#FFF" />
               </View>
            </TouchableOpacity>
            <View style={styles.profileMain}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: theme.textPrimary }]}>{profile.name}</Text>
                <Icon name="check-decagram" size={20} color="#3B82F6" style={{ marginLeft: 6 }} />
              </View>
              <Text style={[styles.specialty, { color: theme.accent }]}>{profile.specialty}</Text>
              <Text style={[styles.experience, { color: theme.textSecondary }]}>{profile.degree} • {profile.experience}</Text>
              <View style={styles.phoneRow}>
                <Icon name="phone" size={14} color={theme.textSecondary} />
                <Text style={[styles.phoneText, { color: theme.textSecondary }]}>{profile.phone || 'No phone added'}</Text>
              </View>
            </View>
            <TouchableOpacity 
                style={[styles.editBtn, { backgroundColor: theme.card }]}
                onPress={() => {
                  setEditForm(profile);
                  setShowEditModal(true);
                }}
            >
              <Icon name="pencil-outline" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
             <View style={[styles.statBox, { backgroundColor: theme.card }]}>
               <Text style={[styles.statNum, { color: theme.textPrimary }]}>12k+</Text>
               <Text style={[styles.statTitle, { color: theme.textSecondary }]}>Patients</Text>
             </View>
             <View style={[styles.statBox, { backgroundColor: theme.card }]}>
               <Text style={[styles.statNum, { color: theme.textPrimary }]}>4.9</Text>
               <Text style={[styles.statTitle, { color: theme.textSecondary }]}>Rating</Text>
             </View>
             <View style={[styles.statBox, { backgroundColor: theme.card }]}>
               <Text style={[styles.statNum, { color: theme.textPrimary }]}>2.5k</Text>
               <Text style={[styles.statTitle, { color: theme.textSecondary }]}>Reviews</Text>
             </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>About Me</Text>
          <View style={[styles.sectionBody, { backgroundColor: theme.card, padding: 16 }]}>
            <Text style={[styles.aboutText, { color: theme.textPrimary }]}>
              {profile.about}
            </Text>
          </View>
        </View>

        {/* Expertise & Services */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Expertise & Services</Text>
          <View style={[styles.sectionBody, { backgroundColor: theme.card, padding: 16 }]}>
            <View style={styles.tagContainer}>
              {profile.services.split(',').map((service, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: theme.accent + '15' }]}>
                  <Text style={[styles.tagText, { color: theme.accent }]}>{service.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>Languages</Text>
          <View style={[styles.sectionBody, { backgroundColor: theme.card, padding: 16, flexDirection: 'row', gap: 8 }]}>
            <Icon name="translate" size={20} color={theme.accent} />
            <Text style={[styles.itemLabel, { color: theme.textPrimary }]}>
              {profile.languages}
            </Text>
          </View>
        </View>

        {/* Setting Groups */}
        {menuItems.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>{section.title}</Text>
            <View style={[styles.sectionBody, { backgroundColor: theme.card }]}>
              {section.items.map((item, idx) => (
                <View key={idx}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.type === 'link' ? item.onPress : undefined}
                    activeOpacity={item.type === 'link' ? 0.6 : 1}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                      <Icon name={item.icon} size={22} color={item.color} />
                    </View>
                    
                    <View style={styles.itemContent}>
                      <Text style={[styles.itemLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                      {item.value && <Text style={[styles.itemValue, { color: theme.textSecondary }]}>{item.value}</Text>}
                    </View>
                    
                    {item.type === 'toggle' ? (
                       <Switch
                          value={item.label === 'Accepting New Patients' ? isOnline : notificationsEnabled}
                          onValueChange={(val) => {
                            if (item.label === 'Accepting New Patients') {
                              setIsOnline(val);
                              updateStatus('online', val);
                            } else {
                              setNotificationsEnabled(val);
                              updateStatus('notifications', val);
                            }
                          }}
                          trackColor={{ false: theme.border, true: '#10B981' }}
                          thumbColor="#FFF"
                       />
                    ) : (
                       <Icon name="chevron-right" size={20} color={theme.textSecondary} style={{ opacity: 0.5 }} />
                    )}
                  </TouchableOpacity>
                  {idx < section.items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.border, marginLeft: 56 }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={[styles.sectionBody, { backgroundColor: theme.card }]}>
             <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={[styles.iconContainer, { backgroundColor: theme.danger + '15' }]}>
                  <Icon name="logout" size={22} color={theme.danger} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.danger, fontWeight: '700' }]}>Logout</Text>
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>
            HelloDoctor For Doctors v1.0.5
          </Text>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Made with ❤️ for Healthcare Professionals
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
               <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Edit Profile</Text>
               <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Icon name="close" size={24} color={theme.textPrimary} />
               </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
               <View style={styles.modalAvatarSection}>
                  <TouchableOpacity style={styles.modalAvatarWrapper} onPress={handleSelectImage}>
                    {editForm.profileImage && editForm.profileImage.trim() !== '' ? (
                       <Image source={{ uri: editForm.profileImage }} style={styles.modalAvatar} />
                    ) : (
                       <Image 
                          source={require('../../../screens/image/logo.png')} 
                          style={[styles.modalAvatar, { backgroundColor: '#FFF' }]} 
                       />
                    )}
                    <View style={styles.modalEditBadge}>
                      <Icon name="camera-plus" size={20} color="#FFF" />
                    </View>
                  </TouchableOpacity>
                  <Text style={[styles.modalHint, { color: theme.textSecondary }]}>Tap to change profile picture</Text>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
                  <TextInput
                    style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                    value={editForm.name}
                    onChangeText={(t) => setEditForm(f => ({ ...f, name: t }))}
                    placeholder="Enter full name"
                    placeholderTextColor={theme.textSecondary}
                  />
               </View>

                <View style={styles.inputGroup}>
                   <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                   <TextInput
                     style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                     value={editForm.phone}
                     onChangeText={(t) => setEditForm(f => ({ ...f, phone: t.replace(/[^0-9]/g, '') }))}
                     placeholder="Phone number"
                     keyboardType="phone-pad"
                     placeholderTextColor={theme.textSecondary}
                   />
                </View>

               <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Specialty</Text>
                  <TextInput
                    style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                    value={editForm.specialty}
                    onChangeText={(t) => setEditForm(f => ({ ...f, specialty: t }))}
                    placeholder="e.g. Cardiologist"
                    placeholderTextColor={theme.textSecondary}
                  />
               </View>

               <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Degree</Text>
                    <TouchableOpacity 
                      style={[styles.formInput, { borderColor: theme.border, backgroundColor: theme.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                      onPress={() => setShowDegreePicker(true)}
                    >
                       <Text style={{ color: editForm.degree ? theme.textPrimary : theme.textSecondary }}>
                          {editForm.degree || 'Select Degree'}
                       </Text>
                       <Icon name="chevron-down" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Experience</Text>
                    <TextInput
                      style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                      value={editForm.experience.replace(/[^0-9]/g, '')}
                      onChangeText={(t) => {
                        const num = t.replace(/[^0-9]/g, '');
                        setEditForm(f => ({ ...f, experience: num ? `${num} Years Experience` : '' }));
                      }}
                      placeholder="e.g. 10"
                      keyboardType="numeric"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Clinic Name</Text>
                  <TextInput
                    style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                    value={editForm.clinic}
                    onChangeText={(t) => setEditForm(f => ({ ...f, clinic: t }))}
                    placeholder="Clinic Details"
                    placeholderTextColor={theme.textSecondary}
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>About Me (Bio)</Text>
                  <TextInput
                    style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card, height: 100, textAlignVertical: 'top' }]}
                    value={editForm.about}
                    onChangeText={(t) => setEditForm(f => ({ ...f, about: t }))}
                    placeholder="Describe your expertise and vision..."
                    placeholderTextColor={theme.textSecondary}
                    multiline={true}
                    numberOfLines={4}
                  />
               </View>

               <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Online Fees (₹)</Text>
                    <TextInput
                      style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                      value={editForm.onlineFees}
                      onChangeText={(t) => setEditForm(f => ({ ...f, onlineFees: t.replace(/[^0-9]/g, '') }))}
                      placeholder="e.g. 500"
                      keyboardType="numeric"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Clinic Fees (₹)</Text>
                    <TextInput
                      style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                      value={editForm.clinicFees}
                      onChangeText={(t) => setEditForm(f => ({ ...f, clinicFees: t.replace(/[^0-9]/g, '') }))}
                      placeholder="e.g. 1000"
                      keyboardType="numeric"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Languages (Comma separated)</Text>
                  <TextInput
                    style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                    value={editForm.languages}
                    onChangeText={(t) => setEditForm(f => ({ ...f, languages: t }))}
                    placeholder="e.g. English, Hindi, Spanish"
                    placeholderTextColor={theme.textSecondary}
                  />
               </View>

               <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Services Offered (Comma separated)</Text>
                  <TextInput
                    style={[styles.formInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.card }]}
                    value={editForm.services}
                    onChangeText={(t) => setEditForm(f => ({ ...f, services: t }))}
                    placeholder="e.g. General Checkup, Heart Surgery"
                    placeholderTextColor={theme.textSecondary}
                  />
               </View>

               <TouchableOpacity 
                  style={[styles.saveBtn, { backgroundColor: theme.accent, opacity: loading ? 0.7 : 1 }]}
                  onPress={handleSave}
                  disabled={loading}
               >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  )}
               </TouchableOpacity>

               <TouchableOpacity 
                  style={[styles.cancelBtn]}
                  onPress={() => setShowEditModal(false)}
               >
                  <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
               </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Degree Picker Modal */}
      <Modal
        visible={showDegreePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDegreePicker(false)}
      >
        <TouchableOpacity 
           activeOpacity={1} 
           style={styles.pickerOverlay} 
           onPress={() => setShowDegreePicker(false)}
        >
          <View style={[styles.pickerContent, { backgroundColor: theme.card }]}>
             <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.textPrimary }]}>Select Degree</Text>
             </View>
             <ScrollView style={{ maxHeight: 400 }}>
                {medicalDegrees.map((deg, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.degreeOption, { borderBottomColor: theme.border }]}
                    onPress={() => {
                        const current = editForm.degree ? editForm.degree.split(', ') : [];
                        if (current.includes(deg)) {
                           const filtered = current.filter(d => d !== deg);
                           setEditForm(f => ({ ...f, degree: filtered.join(', ') }));
                        } else {
                           setEditForm(f => ({ ...f, degree: [...current, deg].join(', ') }));
                        }
                    }}
                  >
                    <Text style={[styles.degreeText, { color: theme.textPrimary }]}>{deg}</Text>
                    {editForm.degree.includes(deg) && <Icon name="check" size={20} color={theme.accent} />}
                  </TouchableOpacity>
                ))}
             </ScrollView>
             <TouchableOpacity 
                style={[styles.doneBtn, { backgroundColor: theme.accent }]}
                onPress={() => setShowDegreePicker(false)}
             >
                <Text style={styles.doneBtnText}>Done</Text>
             </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  navBackBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  navMenuBtn: {
    padding: 4,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileMain: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  specialty: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  experience: {
    fontSize: 13,
    marginTop: 2,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editForm: {
    gap: 4,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '85%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalScroll: {
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  formInput: {
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
  },
  saveBtn: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  pickerContent: {
    borderRadius: 24,
    padding: 20,
    elevation: 8,
  },
  pickerHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  degreeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  degreeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  doneBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  editInput: {
    padding: 0,
    margin: 0,
    borderBottomWidth: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  statTitle: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
    marginBottom: 8,
    opacity: 0.8,
  },
  sectionBody: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemValue: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  phoneText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalAvatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  modalAvatarWrapper: {
    position: 'relative',
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  modalEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  modalHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputHint: {
    opacity: 0.6,
  },
  fallbackAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
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

export default DoctorProfile;

