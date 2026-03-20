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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ChatRoom {
  id: string;
  name: string;
  type: 'event' | 'club' | 'general';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: number;
  eventId?: string;
  clubId?: string;
}

interface Message {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'poll';
}

export default function ChatScreen() {
  const { user } = useAuth();
  const { events, clubs, getUserRegistrations } = useEvents();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'clubs'>('all');
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    generateChatRooms();
  }, [user, events, clubs]);

  useEffect(() => {
    filterRooms();
  }, [chatRooms, searchQuery, activeTab]);

  const generateChatRooms = () => {
    if (!user) return;

    const userRegistrations = getUserRegistrations(user.id);
    const registeredEvents = events.filter(event => 
      userRegistrations.some(reg => reg.eventId === event.id)
    );

    const rooms: ChatRoom[] = [
      // General chat rooms
      {
        id: 'general',
        name: 'General Discussion',
        type: 'general',
        lastMessage: 'Welcome to the community chat!',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        participants: 156,
      },
      {
        id: 'announcements',
        name: 'Announcements',
        type: 'general',
        lastMessage: 'New event registration is now open',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        unreadCount: 2,
        participants: 234,
      },
      {
        id: 'help',
        name: 'Help & Support',
        type: 'general',
        lastMessage: 'How do I register for events?',
        lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        participants: 89,
      },
    ];

    // Add event-specific chat rooms for registered events
    registeredEvents.forEach((event, index) => {
      rooms.push({
        id: `event-${event.id}`,
        name: `${event.title} Discussion`,
        type: 'event',
        lastMessage: 'Looking forward to this event!',
        lastMessageTime: new Date(Date.now() - (index + 1) * 60 * 60 * 1000).toISOString(),
        unreadCount: Math.floor(Math.random() * 5),
        participants: event.currentParticipants,
        eventId: event.id,
      });
    });

    // Add club chat rooms
    clubs.forEach((club, index) => {
      if (club.memberIds.includes(user.id) || user.role === 'admin') {
        rooms.push({
          id: `club-${club.id}`,
          name: `${club.name} Chat`,
          type: 'club',
          lastMessage: 'Planning our next event...',
          lastMessageTime: new Date(Date.now() - (index + 3) * 60 * 60 * 1000).toISOString(),
          unreadCount: Math.floor(Math.random() * 3),
          participants: club.memberIds.length,
          clubId: club.id,
        });
      }
    });

    // Sort by last message time
    rooms.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

    setChatRooms(rooms);
  };

  const filterRooms = () => {
    let filtered = chatRooms;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(room => room.type === activeTab.slice(0, -1)); // Remove 's' from 'events'/'clubs'
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    generateChatRooms();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleRoomPress = (room: ChatRoom) => {
    // In a real app, this would navigate to the chat room
    Alert.alert(
      room.name,
      'Chat functionality would open here. This would include:\n\n• Real-time messaging\n• File sharing\n• Polls and Q&A\n• Event-specific discussions',
      [{ text: 'OK' }]
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString();
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'event':
        return 'calendar-outline';
      case 'club':
        return 'business-outline';
      case 'general':
        return 'chatbubbles-outline';
      default:
        return 'chatbubble-outline';
    }
  };

  const getRoomColor = (type: string) => {
    switch (type) {
      case 'event':
        return '#3498db';
      case 'club':
        return '#27ae60';
      case 'general':
        return '#9b59b6';
      default:
        return '#95a5a6';
    }
  };

  const totalUnread = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Chats</Text>
          {totalUnread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{totalUnread}</Text>
            </View>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tab Filter */}
        <View style={styles.tabContainer}>
          {[
            { key: 'all', label: 'All' },
            { key: 'events', label: 'Events' },
            { key: 'clubs', label: 'Clubs' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.tabButtonActive
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chat Rooms List */}
      <ScrollView
        style={styles.roomsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredRooms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No chats found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'Join events and clubs to start chatting'}
            </Text>
          </View>
        ) : (
          filteredRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomCard}
              onPress={() => handleRoomPress(room)}
            >
              <View style={[
                styles.roomIconContainer,
                { backgroundColor: `${getRoomColor(room.type)}20` }
              ]}>
                <Ionicons
                  name={getRoomIcon(room.type) as any}
                  size={24}
                  color={getRoomColor(room.type)}
                />
              </View>

              <View style={styles.roomInfo}>
                <View style={styles.roomHeader}>
                  <Text style={styles.roomName} numberOfLines={1}>
                    {room.name}
                  </Text>
                  <Text style={styles.roomTime}>
                    {formatTime(room.lastMessageTime)}
                  </Text>
                </View>

                <View style={styles.roomFooter}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {room.lastMessage}
                  </Text>
                  <View style={styles.roomMeta}>
                    <View style={styles.participantCount}>
                      <Ionicons name="people-outline" size={12} color="#95a5a6" />
                      <Text style={styles.participantText}>{room.participants}</Text>
                    </View>
                    {room.unreadCount > 0 && (
                      <View style={styles.unreadIndicator}>
                        <Text style={styles.unreadIndicatorText}>
                          {room.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Chat Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Chat Features</Text>
          
          <View style={styles.featureCard}>
            <Ionicons name="flash-outline" size={24} color="#f39c12" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-time Messaging</Text>
              <Text style={styles.featureDescription}>
                Instant communication with event participants
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="bar-chart-outline" size={24} color="#3498db" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Polls & Q&A</Text>
              <Text style={styles.featureDescription}>
                Create polls and ask questions in event chats
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="document-attach-outline" size={24} color="#27ae60" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>File Sharing</Text>
              <Text style={styles.featureDescription}>
                Share documents, images, and event materials
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="videocam-outline" size={24} color="#e74c3c" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Video Meetings</Text>
              <Text style={styles.featureDescription}>
                Start video calls directly from chat rooms
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Alert.alert(
            'Start New Chat',
            'Choose how you want to start a new conversation:',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Direct Message', onPress: () => {} },
              { text: 'Create Group', onPress: () => {} },
            ]
          );
        }}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
    marginBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  tabTextActive: {
    color: 'white',
  },
  roomsContainer: {
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
  roomCard: {
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
  roomIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  roomTime: {
    fontSize: 12,
    color: '#95a5a6',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
    marginRight: 8,
  },
  roomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  participantText: {
    fontSize: 12,
    color: '#95a5a6',
    marginLeft: 2,
  },
  unreadIndicator: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
  },
  unreadIndicatorText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuresSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  featureContent: {
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});