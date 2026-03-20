import { useAuth } from '@/contexts/AuthContext';
import { Club, useEvents } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function CommunityScreen() {
  const { user } = useAuth();
  const { clubs, getEventsByClub, events } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    filterClubs();
  }, [user, clubs, searchQuery]);

  const filterClubs = () => {
    let filtered = clubs;

    if (searchQuery) {
      filtered = clubs.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredClubs(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getClubEventCount = (clubId: string) => {
    return getEventsByClub(clubId).length;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technology':
        return 'laptop-outline';
      case 'cultural':
        return 'musical-notes-outline';
      case 'sports':
        return 'football-outline';
      case 'academic':
        return 'school-outline';
      default:
        return 'business-outline';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community Hub</Text>
        <Text style={styles.subtitle}>Discover clubs and societies</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clubs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{clubs.length}</Text>
          <Text style={styles.statLabel}>Active Clubs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.length}</Text>
          <Text style={styles.statLabel}>Total Events</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {events.filter(e => e.status === 'upcoming').length}
          </Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
      </View>

      {/* Clubs List */}
      <ScrollView
        style={styles.clubsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredClubs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyStateText}>No clubs found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term' : 'Check back later for new clubs'}
            </Text>
          </View>
        ) : (
          filteredClubs.map((club) => (
            <TouchableOpacity
              key={club.id}
              style={styles.clubCard}
              onPress={() => {
                // Navigate to club details - you can implement this later
              }}
            >
              <View style={styles.clubHeader}>
                <View style={styles.clubIconContainer}>
                  <Ionicons
                    name={getCategoryIcon(club.category) as any}
                    size={24}
                    color="#3498db"
                  />
                </View>
                <View style={styles.clubInfo}>
                  <Text style={styles.clubName}>{club.name}</Text>
                  <Text style={styles.clubCategory}>{club.category}</Text>
                </View>
                <View style={styles.clubStats}>
                  <Text style={styles.memberCount}>{club.memberIds.length}</Text>
                  <Text style={styles.memberLabel}>members</Text>
                </View>
              </View>

              <Text style={styles.clubDescription} numberOfLines={2}>
                {club.description}
              </Text>

              <View style={styles.clubFooter}>
                <View style={styles.eventCount}>
                  <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
                  <Text style={styles.eventCountText}>
                    {getClubEventCount(club.id)} events
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>
                    {club.memberIds.includes(user.id) ? 'Joined' : 'Join'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Community Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Community Features</Text>
          
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="chatbubbles-outline" size={24} color="#3498db" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Discussion Forums</Text>
              <Text style={styles.featureDescription}>
                Join conversations with fellow students
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="help-circle-outline" size={24} color="#27ae60" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Q&A Section</Text>
              <Text style={styles.featureDescription}>
                Ask questions and get answers from experts
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="star-outline" size={24} color="#f39c12" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Event Reviews</Text>
              <Text style={styles.featureDescription}>
                Share your event experiences
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="trophy-outline" size={24} color="#e74c3c" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Achievements</Text>
              <Text style={styles.featureDescription}>
                Earn badges for participation
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#95a5a6" />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 16,
  },
  clubsContainer: {
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
  clubCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clubIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  clubCategory: {
    fontSize: 12,
    color: '#3498db',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  clubStats: {
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  memberLabel: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  clubDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  clubFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventCountText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  joinButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  featuresSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  featureCard: {
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
  featureContent: {
    flex: 1,
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
});