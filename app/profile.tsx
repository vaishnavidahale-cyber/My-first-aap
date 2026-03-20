import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { getUserRegistrations, events } = useEvents();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const userRegistrations = getUserRegistrations(user.id);
  const registeredEvents = events.filter(event => 
    userRegistrations.some(reg => reg.eventId === event.id)
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#e74c3c';
      case 'host':
        return '#f39c12';
      case 'student':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return 'shield-checkmark-outline';
      case 'host':
        return 'megaphone-outline';
      case 'student':
        return 'school-outline';
      default:
        return 'person-outline';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <Image 
              source={require('@/assets/images/app-logo.jpeg')} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          )}
        </View>
        
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.college}>{user.college}</Text>
        
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
          <Ionicons name={getRoleIcon(user.role) as any} size={16} color="white" />
          <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{registeredEvents.length}</Text>
          <Text style={styles.statLabel}>Events Registered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {registeredEvents.filter(e => e.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Events Attended</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {registeredEvents.filter(e => e.status === 'upcoming').length}
          </Text>
          <Text style={styles.statLabel}>Upcoming Events</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Ionicons name="calendar-outline" size={24} color="#3498db" />
          <Text style={styles.menuText}>My Events</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        {(user.role === 'admin' || user.role === 'host') && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/create-event')}
          >
            <Ionicons name="add-circle-outline" size={24} color="#27ae60" />
            <Text style={styles.menuText}>Create Event</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
          </TouchableOpacity>
        )}

        {user.role === 'admin' && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin')}
          >
            <Ionicons name="settings-outline" size={24} color="#f39c12" />
            <Text style={styles.menuText}>Admin Panel</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#9b59b6" />
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#34495e" />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={24} color="#16a085" />
          <Text style={styles.menuText}>About</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
        </TouchableOpacity>
      </View>

      {/* Recent Events */}
      {registeredEvents.length > 0 && (
        <View style={styles.recentEventsContainer}>
          <Text style={styles.sectionTitle}>Recent Registrations</Text>
          {registeredEvents.slice(0, 3).map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventItem}
              onPress={() => router.push(`/event/${event.id}`)}
            >
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={[
                styles.eventStatus,
                { backgroundColor: event.status === 'upcoming' ? '#27ae60' : '#95a5a6' }
              ]}>
                <Text style={styles.eventStatusText}>
                  {event.status.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Event Forum Hub v1.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  college: {
    fontSize: 14,
    color: '#95a5a6',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 16,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 16,
  },
  recentEventsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
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
  eventDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  eventStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventStatusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#95a5a6',
  },
});