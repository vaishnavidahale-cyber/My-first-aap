import { useAuth } from '@/contexts/AuthContext';
import { Event, useEvents } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { events, registerForEvent, getUserRegistrations } = useEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const foundEvent = events.find(e => e.id === id);
    setEvent(foundEvent || null);

    if (foundEvent && user) {
      const userRegistrations = getUserRegistrations(user.id);
      setIsRegistered(userRegistrations.some(reg => reg.eventId === foundEvent.id));
    }
  }, [id, events, user]);

  const handleRegister = async () => {
    if (!event || !user) return;

    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      Alert.alert('Event Full', 'This event has reached maximum capacity.');
      return;
    }

    Alert.alert(
      'Register for Event',
      `Do you want to register for "${event.title}"?${event.price > 0 ? `\n\nPrice: ₹${event.price}` : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Register',
          onPress: async () => {
            const success = await registerForEvent(event.id, user.id, user.name, user.email);
            if (success) {
              setIsRegistered(true);
              if (event.price > 0) {
                Alert.alert(
                  'Registration Successful!',
                  'Please proceed to payment to complete your registration.',
                  [
                    { text: 'Pay Later', style: 'cancel' },
                    { text: 'Pay Now', onPress: handlePayment }
                  ]
                );
              } else {
                Alert.alert('Success', 'You have been registered for this event!');
              }
            } else {
              Alert.alert('Error', 'Failed to register for the event. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handlePayment = () => {
    // Mock payment integration - In real app, integrate with Razorpay/Stripe
    Alert.alert(
      'Payment',
      'Redirecting to payment gateway...',
      [
        {
          text: 'Mock Payment Success',
          onPress: () => {
            Alert.alert('Payment Successful', 'Your registration is now complete!');
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\nDate: ${event.date}\nVenue: ${event.venue}\n\nJoin me at this amazing event!`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openRegistrationLink = () => {
    if (event?.registrationLink) {
      Linking.openURL(event.registrationLink);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {event.poster && (
        <Image source={{ uri: event.poster }} style={styles.poster} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: event.status === 'upcoming' ? '#27ae60' : '#f39c12' }]}>
            <Text style={styles.statusText}>{event.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.category}>{event.category}</Text>
        </View>

        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#3498db" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#3498db" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formatTime(event.time)}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#3498db" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue}>{event.venue}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={20} color="#3498db" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Host</Text>
              <Text style={styles.detailValue}>{event.hostName}</Text>
            </View>
          </View>

          {event.clubName && (
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={20} color="#3498db" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Club</Text>
                <Text style={styles.detailValue}>{event.clubName}</Text>
              </View>
            </View>
          )}

          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={20} color="#3498db" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Participants</Text>
              <Text style={styles.detailValue}>
                {event.currentParticipants}
                {event.maxParticipants && `/${event.maxParticipants}`} registered
              </Text>
            </View>
          </View>

          {event.price > 0 && (
            <View style={styles.detailItem}>
              <Ionicons name="card-outline" size={20} color="#3498db" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.priceValue}>₹{event.price}</Text>
              </View>
            </View>
          )}
        </View>

        {event.rules && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rules & Guidelines</Text>
            <Text style={styles.sectionContent}>{event.rules}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL(`mailto:${event.contactInfo}`)}
            style={styles.contactButton}
          >
            <Ionicons name="mail-outline" size={16} color="#3498db" />
            <Text style={styles.contactText}>{event.contactInfo}</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.qrToggleButton}
            onPress={() => setShowQR(!showQR)}
          >
            <Ionicons name="qr-code-outline" size={20} color="#3498db" />
            <Text style={styles.qrToggleText}>
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </Text>
          </TouchableOpacity>

          {showQR && (
            <View style={styles.qrContainer}>
              <QRCode
                value={`event:${event.id}:${event.title}`}
                size={200}
                backgroundColor="white"
                color="black"
              />
              <Text style={styles.qrText}>Scan to share this event</Text>
            </View>
          )}
        </View>

        {/* Registration Buttons */}
        <View style={styles.actionButtons}>
          {!isRegistered ? (
            <TouchableOpacity
              style={[
                styles.registerButton,
                (event.maxParticipants && event.currentParticipants >= event.maxParticipants) && styles.disabledButton
              ]}
              onPress={handleRegister}
              disabled={event.maxParticipants && event.currentParticipants >= event.maxParticipants}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              <Text style={styles.registerButtonText}>
                {event.maxParticipants && event.currentParticipants >= event.maxParticipants
                  ? 'Event Full'
                  : 'Register Now'
                }
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.registeredContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <Text style={styles.registeredText}>You are registered!</Text>
            </View>
          )}

          {event.registrationLink && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={openRegistrationLink}
            >
              <Ionicons name="link-outline" size={20} color="#3498db" />
              <Text style={styles.linkButtonText}>External Registration</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  poster: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 12,
  },
  shareButton: {
    padding: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  category: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#95a5a6',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 2,
  },
  priceValue: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#3498db',
    marginLeft: 8,
  },
  qrToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  qrToggleText: {
    fontSize: 16,
    color: '#3498db',
    marginLeft: 8,
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  qrText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 40,
  },
  registerButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  registeredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#d5f4e6',
    borderRadius: 12,
    marginBottom: 12,
  },
  registeredText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  linkButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  linkButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
});