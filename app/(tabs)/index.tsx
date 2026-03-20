import EventCard from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { Event, useEvents } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const { events, searchEvents, isLoading } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const categories = ['All', 'Technology', 'Cultural', 'Sports', 'Academic', 'Workshop'];

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    filterEvents();
  }, [user, events, searchQuery, selectedCategory]);

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = searchEvents(searchQuery);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Sort by date (upcoming first)
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setFilteredEvents(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, this would refresh data from server
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('@/assets/images/app-logo.jpeg')} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.greeting}>Hello, {user.name}! 👋</Text>
              <Text style={styles.subGreeting}>Discover amazing events</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-circle-outline" size={32} color="#3498db" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView
        style={styles.eventsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No events found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'Check back later for new events'}
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/event/${event.id}`)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button for Admins/Hosts */}
      {(user.role === 'admin' || user.role === 'host') && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/create-event')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subGreeting: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
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
  categoryContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
  },
  categoryText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  eventsContainer: {
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
