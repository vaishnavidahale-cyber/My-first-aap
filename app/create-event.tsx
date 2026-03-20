import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function CreateEventScreen() {
  const { user } = useAuth();
  const { addEvent, clubs } = useEvents();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: new Date(),
    venue: '',
    category: 'Technology',
    rules: '',
    contactInfo: user?.email || '',
    price: '0',
    maxParticipants: '',
    clubId: '',
    registrationLink: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Technology', 'Cultural', 'Sports', 'Academic', 'Workshop'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ ...prev, time: selectedTime }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter event title');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter event description');
      return false;
    }
    if (!formData.venue.trim()) {
      Alert.alert('Error', 'Please enter venue');
      return false;
    }
    if (!formData.contactInfo.trim()) {
      Alert.alert('Error', 'Please enter contact information');
      return false;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      Alert.alert('Error', 'Please enter valid price');
      return false;
    }
    if (formData.maxParticipants && (isNaN(Number(formData.maxParticipants)) || Number(formData.maxParticipants) <= 0)) {
      Alert.alert('Error', 'Please enter valid maximum participants');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user) return;

    setIsSubmitting(true);

    try {
      const selectedClub = clubs.find(club => club.id === formData.clubId);
      
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date.toISOString().split('T')[0],
        time: formData.time.toTimeString().split(' ')[0].substring(0, 5),
        venue: formData.venue.trim(),
        category: formData.category,
        rules: formData.rules.trim(),
        contactInfo: formData.contactInfo.trim(),
        hostId: user.id,
        hostName: user.name,
        clubId: formData.clubId || undefined,
        clubName: selectedClub?.name || undefined,
        registrationLink: formData.registrationLink.trim() || undefined,
        price: Number(formData.price),
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        currentParticipants: 0,
        registeredUsers: [],
        status: 'upcoming' as const,
      };

      await addEvent(eventData);
      
      Alert.alert(
        'Success',
        'Event created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'host')) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You don't have permission to create events.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Event</Text>
        <Text style={styles.subtitle}>Fill in the details to create an amazing event</Text>
      </View>

      <View style={styles.form}>
        {/* Event Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your event..."
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Date and Time */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#7f8c8d" />
              <Text style={styles.dateTimeText}>
                {formData.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#7f8c8d" />
              <Text style={styles.dateTimeText}>
                {formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Venue */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Venue *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter venue location"
            value={formData.venue}
            onChangeText={(value) => handleInputChange('venue', value)}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  formData.category === category && styles.categoryButtonActive
                ]}
                onPress={() => handleInputChange('category', category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    formData.category === category && styles.categoryButtonTextActive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Club Selection */}
        {clubs.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Club (Optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  !formData.clubId && styles.categoryButtonActive
                ]}
                onPress={() => handleInputChange('clubId', '')}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    !formData.clubId && styles.categoryButtonTextActive
                  ]}
                >
                  No Club
                </Text>
              </TouchableOpacity>
              {clubs.map((club) => (
                <TouchableOpacity
                  key={club.id}
                  style={[
                    styles.categoryButton,
                    formData.clubId === club.id && styles.categoryButtonActive
                  ]}
                  onPress={() => handleInputChange('clubId', club.id)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      formData.clubId === club.id && styles.categoryButtonTextActive
                    ]}
                  >
                    {club.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Price and Max Participants */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Max Participants</Text>
            <TextInput
              style={styles.input}
              placeholder="Unlimited"
              value={formData.maxParticipants}
              onChangeText={(value) => handleInputChange('maxParticipants', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Information *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact email"
            value={formData.contactInfo}
            onChangeText={(value) => handleInputChange('contactInfo', value)}
            keyboardType="email-address"
          />
        </View>

        {/* Registration Link */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>External Registration Link (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/register"
            value={formData.registrationLink}
            onChangeText={(value) => handleInputChange('registrationLink', value)}
            keyboardType="url"
          />
        </View>

        {/* Rules */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rules & Guidelines (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter event rules and guidelines..."
            value={formData.rules}
            onChangeText={(value) => handleInputChange('rules', value)}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
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
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  dateTimeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 8,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
});