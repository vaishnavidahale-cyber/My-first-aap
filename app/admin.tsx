import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AdminScreen() {
  const { user } = useAuth();
  const { events, clubs, registrations, deleteEvent } = useEvents();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="shield-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorText}>Access Denied</Text>
          <Text style={styles.errorSubtext}>You don't have admin privileges</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteEvent(eventId);
            Alert.alert('Success', 'Event deleted successfully');
          }
        }
      ]
    );
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const totalRegistrations = registrations.length;
  const totalRevenue = registrations
    .filter(r => r.paymentStatus === 'completed')
    .reduce((sum, r) => {
      const event = events.find(e => e.id === r.eventId);
      return sum + (event?.price || 0);
    }, 0);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>Manage events and users</Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={20} color="white" />
            <Text style={styles.adminText}>ADMIN</Text>
          </View>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={24} color="#3498db" />
          <Text style={styles.statNumber}>{events.length}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={24} color="#27ae60" />
          <Text style={styles.statNumber}>{totalRegistrations}</Text>
          <Text style={styles.statLabel}>Registrations</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="business-outline" size={24} color="#f39c12" />
          <Text style={styles.statNumber}>{clubs.length}</Text>
          <Text style={styles.statLabel}>Active Clubs</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="card-outline" size={24} color="#e74c3c" />
          <Text style={styles.statNumber}>₹{totalRevenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/create-event')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#27ae60" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Create New Event</Text>
            <Text style={styles.actionDescription}>Add a new event to the platform</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="people-outline" size={24} color="#3498db" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Users</Text>
            <Text style={styles.actionDescription}>View and manage user accounts</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="business-outline" size={24} color="#f39c12" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Clubs</Text>
            <Text style={styles.actionDescription}>Create and manage clubs</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="bar-chart-outline" size={24} color="#9b59b6" />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionDescription}>View detailed reports and analytics</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>
      </View>

      {/* Recent Events Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Management</Text>
        
        {upcomingEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No upcoming events</Text>
          </View>
        ) : (
          upcomingEvents.slice(0, 5).map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                <Text style={styles.eventMeta}>
                  {new Date(event.date).toLocaleDateString()} • {event.currentParticipants} registered
                </Text>
                <Text style={styles.eventCategory}>{event.category}</Text>
              </View>
              
              <View style={styles.eventActions}>
                <TouchableOpacity
                  style={styles.eventActionButton}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <Ionicons name="eye-outline" size={16} color="#3498db" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.eventActionButton}
                  onPress={() => {
                    // Edit functionality would go here
                    Alert.alert('Edit Event', 'Edit functionality would be implemented here');
                  }}
                >
                  <Ionicons name="create-outline" size={16} color="#f39c12" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.eventActionButton, styles.deleteButton]}
                  onPress={() => handleDeleteEvent(event.id, event.title)}
                >
                  <Ionicons name="trash-outline" size={16} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* System Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#3498db" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Configure notification settings</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="shield-outline" size={24} color="#27ae60" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Security Settings</Text>
            <Text style={styles.settingDescription}>Manage app security and permissions</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="document-text-outline" size={24} color="#f39c12" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Export Data</Text>
            <Text style={styles.settingDescription}>Export events and user data</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="refresh-outline" size={24} color="#9b59b6" />
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>System Maintenance</Text>
            <Text style={styles.settingDescription}>Clear cache and optimize performance</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Admin Panel v1.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  adminText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
  },
  eventCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  eventMeta: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  eventCategory: {
    fontSize: 10,
    color: '#3498db',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  eventActions: {
    flexDirection: 'row',
  },
  eventActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#fdf2f2',
  },
  settingItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
  },
});