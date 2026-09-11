import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemePalette } from '../../../theme/palette';
import { useThemeContext } from '../../../theme/ThemeContext';
import { getDoctorProfile, getDoctorNotifications, markNotificationsRead } from '../../../utils/api';
import { getUserSession } from '../../../utils/storage';

type DoctorHomeProps = {
  theme: ThemePalette;
  onLogout: () => void;
  onViewCalendar?: () => void;
};

const DoctorHome: React.FC<DoctorHomeProps> = ({ theme, onLogout, onViewCalendar }) => {
  const { mode } = useThemeContext();
  const [profile, setProfile] = React.useState({ name: '', profileImage: '' });
  const [isReady, setIsReady] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const session = await getUserSession();
        if (session && (session.user || session.data)) {
          const userData = session.user || session.data;
          setProfile(prev => ({
            ...prev,
            name: userData.name || 'Doctor',
          }));
        }
      } catch (e) {
        console.log('Session load error:', e);
      } finally {
        setIsReady(true);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await getDoctorProfile();
        if (res && (res.data || res.profile)) {
          const data = res.data || res.profile;
          const backendName = data.basicInfo?.name;
          const backendImage = data.basicInfo?.profileImage;

          setProfile(prev => ({
            name: backendName && backendName.trim() !== '' ? backendName : prev.name,
            profileImage: backendImage && backendImage.trim() !== '' ? backendImage : prev.profileImage,
          }));
        }
      } catch (error) {
        console.log('Home profile fetch note:', error);
      }
    };

    loadInitialData().then(fetchProfile);
  }, []);

  // Fetch notifications
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getDoctorNotifications();
        if (res?.success) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (e) {
        console.log('Notification fetch error:', e);
      }
    };
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const session = await getUserSession();
      const userId = session?.userId || session?.user?.id || session?.data?._id;
      if (userId) {
        await markNotificationsRead({ userId });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (e) {
      console.log('Mark read error:', e);
    }
  };

  const handleNotifClick = async (notifId: string) => {
    // Optimistically close modal and navigate
    setShowNotifications(false);
    if (onViewCalendar) {
      onViewCalendar();
    }
    // Mark as read
    try {
      const session = await getUserSession();
      const userId = session?.userId || session?.user?.id || session?.data?._id;
      if (userId) {
        await markNotificationsRead({ userId, notificationIds: [notifId] });
        setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.log('Failed to mark notification as read:', e);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'In-Call':
        return {
          backgroundColor: '#DCFCE7',
          textColor: '#166534',
        };
      case 'Waiting':
        return {
          backgroundColor: '#FEF3C7',
          textColor: '#D97706',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          textColor: theme.textSecondary,
        };
    }
  };

  if (!isReady) {
    return null;
  }

  const metrics = [
    { label: 'Total Patients', value: '0', icon: 'account-group', color: theme.accent, trend: '0%' },
    { label: 'Appointments', value: '0', icon: 'calendar-check', color: theme.hero, trend: '0%' },
    { label: 'Pending Reviews', value: '0', icon: 'file-document-edit', color: theme.warning, trend: '0' },
    { label: 'Rating', value: '0.0', icon: 'star', color: '#FBBF24', trend: 'New' },
  ];

  const upcomingAppointments: any[] = [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      {/* Enhanced Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
            <TouchableOpacity activeOpacity={0.8}>
               {profile.profileImage && profile.profileImage.trim() !== '' ? (
                  <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
               ) : (
                  <Image 
                     source={require('../../../screens/image/logo.png')} 
                     style={[styles.avatar, { backgroundColor: '#FFF' }]} 
                  />
               )}
            </TouchableOpacity>
            <View>
              <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back,</Text>
              <View style={styles.nameRow}>
                 <Text style={[styles.doctorName, { color: theme.textPrimary }]}>{profile.name}</Text>
                <Icon name="check-decagram" size={16} color={theme.accent} style={{ marginLeft: 4 }} />
             </View>
           </View>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.background }]} onPress={() => setShowNotifications(true)}>
          <Icon name="bell-outline" size={24} color={theme.textPrimary} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.danger }]}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Modern Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((item) => (
            <View key={item.label} style={[styles.metricCard, { backgroundColor: theme.card }]}>
              <View style={styles.metricHeader}>
                 <View style={[styles.metricIcon, { backgroundColor: item.color + '15' }]}>
                    <Icon name={item.icon} size={22} color={item.color} />
                 </View>
                 <Text style={[styles.trendText, { color: item.trend.startsWith('-') ? theme.danger : theme.success }]}>
                    {item.trend}
                 </Text>
              </View>
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{item.value}</Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.hero }]}>
              <View style={styles.actionIconBox}>
                 <Icon name="calendar-plus" size={24} color="#fff" />
              </View>
              <View>
                 <Text style={styles.actionBtnText}>Add Slot</Text>
                 <Text style={styles.actionBtnSub}>New appointment</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.accent }]}>
              <View style={styles.actionIconBox}>
                 <Icon name="account-search" size={24} color="#fff" />
              </View>
              <View>
                 <Text style={styles.actionBtnText}>Search</Text>
                 <Text style={styles.actionBtnSub}>Find patient</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Appointment List */}
        <View style={styles.section}>
           <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Today's Queue</Text>
            <TouchableOpacity onPress={onViewCalendar}>
              <Text style={[styles.seeAll, { color: theme.hero }]}>View Calendar</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appt, i) => {
              const badgeStyle = getStatusBadgeStyle(appt.status);
              return (
                <View key={appt.id || appt._id || `${appt.name}-${appt.time}-${i}`} style={[styles.apptCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.apptLeft}>
                     <View style={[styles.timeBadge, { backgroundColor: theme.background }]}>
                        <Text style={[styles.timeText, { color: theme.textPrimary }]}>{appt.time}</Text>
                     </View>
                     <View style={styles.verticalLine} />
                  </View>
                  
                  <View style={styles.apptContent}>
                     <View style={styles.apptHeader}>
                        <Text style={[styles.apptName, { color: theme.textPrimary }]}>{appt.name}</Text>
                        {appt.type === 'Video' ? (
                           <Icon name="video" size={18} color="#7C3AED" />
                        ) : (
                           <Icon name="hospital-building" size={18} color="#059669" />
                        )}
                     </View>
                     <Text style={[styles.apptGender, { color: theme.textSecondary }]}>{appt.gender}</Text>
                     
                     <View style={styles.apptFooter}>
                        <View style={[
                           styles.statusBadge, 
                           { backgroundColor: badgeStyle.backgroundColor }
                        ]}>
                           <Text style={{ 
                              fontSize: 12, 
                              fontWeight: '600', 
                              color: badgeStyle.textColor 
                           }}>
                              {appt.status}
                           </Text>
                        </View>
                        <TouchableOpacity style={styles.actionIcon}>
                           <Icon name="chevron-right" size={20} color={theme.textSecondary} />
                        </TouchableOpacity>
                     </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Icon name="calendar-blank" size={48} color={theme.border} />
              <Text style={{ color: theme.textSecondary, marginTop: 12 }}>No appointments in queue for today.</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <TouchableOpacity onPress={() => setShowNotifications(false)} style={styles.modalCloseBtn}>
                <Icon name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Notifications</Text>
              {unreadCount > 0 ? (
                <TouchableOpacity onPress={handleMarkAllRead}>
                  <Text style={[styles.markReadText, { color: theme.accent }]}>Mark all read</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: 40 }} />
              )}
            </View>

            <ScrollView contentContainerStyle={styles.notifScrollContent} showsVerticalScrollIndicator={false}>
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <TouchableOpacity
                    key={notif._id || `notif-${notif.createdAt || idx}`}
                    activeOpacity={0.7}
                    onPress={() => handleNotifClick(notif._id)}
                    style={[
                      styles.notifCard,
                      {
                        backgroundColor: notif.read ? theme.card : theme.accent + '08',
                        borderColor: notif.read ? theme.border : theme.accent + '20',
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <View style={[styles.notifIconWrap, { backgroundColor: theme.accent + '15' }]}>
                      <Icon
                        name={notif.type === 'appointment_booked' ? 'calendar-check' : 'bell'}
                        size={20}
                        color={theme.accent}
                      />
                    </View>
                    <View style={styles.notifBody}>
                      <Text style={[styles.notifTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                        {notif.title}
                      </Text>
                      <Text style={[styles.notifMsg, { color: theme.textSecondary }]} numberOfLines={2}>
                        {notif.message}
                      </Text>
                      <Text style={[styles.notifTime, { color: theme.textSecondary }]}>
                        {formatTimeAgo(notif.createdAt)}
                      </Text>
                    </View>
                    {!notif.read && (
                      <View style={[styles.unreadDot, { backgroundColor: theme.accent }]} />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyNotif}>
                  <View style={[styles.emptyNotifIcon, { backgroundColor: theme.card }]}>
                    <Icon name="bell-off-outline" size={48} color={theme.textSecondary} />
                  </View>
                  <Text style={[styles.emptyNotifTitle, { color: theme.textPrimary }]}>No notifications</Text>
                  <Text style={[styles.emptyNotifSub, { color: theme.textSecondary }]}>You're all caught up!</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  greeting: {
    fontSize: 13,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
  },
  fallbackAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 10,
    borderRadius: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    width: '47%',
    padding: 16,
    borderRadius: 20,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actionIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  actionBtnSub: {
     color: 'rgba(255,255,255,0.8)',
     fontSize: 11,
  },
  apptCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    marginBottom: 4,
  },
  apptLeft: {
    alignItems: 'center',
    gap: 8,
  },
  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 1,
  },
  apptContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  apptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apptName: {
    fontSize: 16,
    fontWeight: '700',
  },
  apptGender: {
    fontSize: 13,
    marginTop: 2,
  },
  apptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionIcon: {
    padding: 4,
  },
  // ── Notification Cards ──
  notifCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  notifIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBody: {
    flex: 1,
    gap: 3,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  notifMsg: {
    fontSize: 12,
    lineHeight: 17,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.6,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notifScrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  emptyNotif: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyNotifIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyNotifTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyNotifSub: {
    fontSize: 14,
  },
});

export default DoctorHome;
