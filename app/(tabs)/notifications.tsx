import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'reminder' | 'announcement' | 'registration';
  timestamp: string;
  read: boolean;
  eventId?: string;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { events, getUserRegistrations } = useEvents();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    generateNotifications();
  }, [user, events]);

  const generateNotifications = () => {
    if (!user) return;

    const userRegistrations = getUserRegistrations(user.id);
    const registeredEvents = events.filter(event => 
      userRegistrations.some(reg => reg.eventId === event.id)
    );

    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to Event Forum Hub!',
        message: 'Discover amazing events and connect with your campus community.',
        type: 'announcement',
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: '2',
        title: 'New Event Available',
        message: 'Tech Fest 2024 registration is now open. Don\'t miss out!',
        type: 'event',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        eventId: '1',
      },
    ];

    // Add event reminders for registered events
    registeredEvents.forEach((event, index) => {
      const eventDate = new Date(event.date);
      const now = new Date();
      const timeDiff = eventDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff <= 7 && daysDiff > 0) {
        mockNotifications.push({
          id: `reminder-${event.id}`,
          title: 'Event Reminder',
          message: `${event.title} is coming up in ${daysDiff} day${daysDiff > 1 ? 's' : ''}!`,
          type: 'reminder',
          timestamp: new Date(Date.now() - index * 30 * 60 * 1000).toISOString(),
          read: false,
          eventId: event.id,
        });
      }
    });

    // Add registration confirmations
    userRegistrations.forEach((registration, index) => {
      const event = events.find(e => e.id === registration.eventId);
      if (event) {
        mockNotifications.push({
          id: `reg-${registration.id}`,
          title: 'Registration Confirmed',
          message: `You're registered for ${event.title}. See you there!`,
          type: 'registration',
          timestamp: registration.registeredAt,
          read: true,
          eventId: event.id,
        });
      }
    });

    // Sort by timestamp (newest first)
    mockNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setNotifications(mockNotifications);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    generateNotifications();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev =>
              prev.filter(notif => notif.id !== notificationId)
            );
          }
        }
      ]
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.eventId) {
      router.push(`/event/${notification.eventId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return 'calendar-outline';
      case 'reminder':
        return 'alarm-outline';
      case 'announcement':
        return 'megaphone-outline';
      case 'registration':
        return 'checkmark-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event':
        return '#3498db';
      case 'reminder':
        return '#f39c12';
      case 'announcement':
        return '#9b59b6';
      case 'registration':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Ionicons name="checkmark-done-outline" size={16} color="#3498db" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No notifications</Text>
            <Text style={styles.emptyStateSubtext}>
              You're all caught up! Check back later for updates.
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: `${getNotificationColor(notification.type)}20` }
                  ]}>
                    <Ionicons
                      name={getNotificationIcon(notification.type) as any}
                      size={20}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>
                  
                  <View style={styles.notificationInfo}>
                    <Text style={[
                      styles.notificationTitle,
                      !notification.read && styles.unreadTitle
                    ]}>
                      {notification.title}
                    </Text>
                    <Text style={styles.timestamp}>
                      {formatTimestamp(notification.timestamp)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteNotification(notification.id)}
                  >
                    <Ionicons name="close-outline" size={20} color="#95a5a6" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>

                {!notification.read && (
                  <View style={styles.unreadIndicator} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Notification Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Notification Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="calendar-outline" size={24} color="#3498db" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Event Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified about upcoming events
              </Text>
            </View>
            <Ionicons name="toggle" size={24} color="#27ae60" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="megaphone-outline" size={24} color="#f39c12" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Announcements</Text>
              <Text style={styles.settingDescription}>
                Important updates and news
              </Text>
            </View>
            <Ionicons name="toggle" size={24} color="#27ae60" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="chatbubbles-outline" size={24} color="#9b59b6" />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Community Updates</Text>
              <Text style={styles.settingDescription}>
                New posts and discussions
              </Text>
            </View>
            <Ionicons name="toggle-outline" size={24} color="#95a5a6" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 4,
    fontWeight: '500',
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  notificationContent: {
    padding: 16,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#95a5a6',
  },
  deleteButton: {
    padding: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginLeft: 52,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
  },
  settingsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});