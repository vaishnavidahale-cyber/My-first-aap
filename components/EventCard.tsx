import { Event } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#27ae60';
      case 'ongoing':
        return '#f39c12';
      case 'completed':
        return '#95a5a6';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#3498db';
    }
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
      case 'workshop':
        return 'construct-outline';
      default:
        return 'calendar-outline';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {event.poster && (
        <Image source={{ uri: event.poster }} style={styles.poster} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <Ionicons
              name={getCategoryIcon(event.category) as any}
              size={16}
              color="#3498db"
            />
            <Text style={styles.category}>{event.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
            <Text style={styles.statusText}>{event.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>{formatDate(event.date)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>{formatTime(event.time)}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#7f8c8d" />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.venue}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.participantInfo}>
            <Ionicons name="people-outline" size={16} color="#7f8c8d" />
            <Text style={styles.participantText}>
              {event.currentParticipants}
              {event.maxParticipants && `/${event.maxParticipants}`} registered
            </Text>
          </View>
          
          {event.price > 0 && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{event.price}</Text>
            </View>
          )}
        </View>

        {event.clubName && (
          <View style={styles.clubInfo}>
            <Ionicons name="business-outline" size={14} color="#95a5a6" />
            <Text style={styles.clubName}>by {event.clubName}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  priceContainer: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  clubName: {
    fontSize: 12,
    color: '#95a5a6',
    marginLeft: 4,
    fontStyle: 'italic',
  },
});

export default EventCard;