import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  poster?: string;
  rules?: string;
  contactInfo: string;
  hostId: string;
  hostName: string;
  clubId?: string;
  clubName?: string;
  registrationLink?: string;
  qrCode?: string;
  price: number;
  maxParticipants?: number;
  currentParticipants: number;
  registeredUsers: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  adminIds: string[];
  memberIds: string[];
  logo?: string;
  category: string;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
}

interface EventContextType {
  events: Event[];
  clubs: Club[];
  registrations: EventRegistration[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string, userId: string, userName: string, userEmail: string) => Promise<boolean>;
  getEventsByCategory: (category: string) => Event[];
  getEventsByClub: (clubId: string) => Event[];
  getUserRegistrations: (userId: string) => EventRegistration[];
  searchEvents: (query: string) => Event[];
  isLoading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load events
      const eventsData = await AsyncStorage.getItem('events');
      if (eventsData) {
        setEvents(JSON.parse(eventsData));
      } else {
        // Initialize with mock data
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Tech Fest 2024',
            description: 'Annual technology festival with coding competitions, workshops, and tech talks.',
            date: '2024-03-15',
            time: '09:00',
            venue: 'Main Auditorium',
            category: 'Technology',
            contactInfo: 'techfest@college.edu',
            hostId: '3',
            hostName: 'Event Host',
            clubId: '1',
            clubName: 'Computer Science Club',
            price: 500,
            maxParticipants: 200,
            currentParticipants: 45,
            registeredUsers: [],
            status: 'upcoming',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Cultural Night',
            description: 'Celebrate diversity with music, dance, and cultural performances.',
            date: '2024-03-20',
            time: '18:00',
            venue: 'College Ground',
            category: 'Cultural',
            contactInfo: 'cultural@college.edu',
            hostId: '3',
            hostName: 'Event Host',
            clubId: '2',
            clubName: 'Cultural Society',
            price: 200,
            maxParticipants: 500,
            currentParticipants: 120,
            registeredUsers: [],
            status: 'upcoming',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ];
        setEvents(mockEvents);
        await AsyncStorage.setItem('events', JSON.stringify(mockEvents));
      }

      // Load clubs
      const clubsData = await AsyncStorage.getItem('clubs');
      if (clubsData) {
        setClubs(JSON.parse(clubsData));
      } else {
        const mockClubs: Club[] = [
          {
            id: '1',
            name: 'Computer Science Club',
            description: 'For tech enthusiasts and coding lovers',
            adminIds: ['3'],
            memberIds: ['2'],
            category: 'Technology',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Cultural Society',
            description: 'Promoting arts, culture, and creativity',
            adminIds: ['3'],
            memberIds: ['2'],
            category: 'Cultural',
            createdAt: new Date().toISOString(),
          }
        ];
        setClubs(mockClubs);
        await AsyncStorage.setItem('clubs', JSON.stringify(mockClubs));
      }

      // Load registrations
      const registrationsData = await AsyncStorage.getItem('registrations');
      if (registrationsData) {
        setRegistrations(JSON.parse(registrationsData));
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const updatedEvents = events.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      );
      setEvents(updatedEvents);
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const registerForEvent = async (eventId: string, userId: string, userName: string, userEmail: string): Promise<boolean> => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return false;

      if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
        return false; // Event is full
      }

      const newRegistration: EventRegistration = {
        id: Date.now().toString(),
        eventId,
        userId,
        userName,
        userEmail,
        registeredAt: new Date().toISOString(),
        paymentStatus: event.price > 0 ? 'pending' : 'completed',
      };

      const updatedRegistrations = [...registrations, newRegistration];
      setRegistrations(updatedRegistrations);
      await AsyncStorage.setItem('registrations', JSON.stringify(updatedRegistrations));

      // Update event participant count
      await updateEvent(eventId, {
        currentParticipants: event.currentParticipants + 1,
        registeredUsers: [...event.registeredUsers, userId]
      });

      return true;
    } catch (error) {
      console.error('Error registering for event:', error);
      return false;
    }
  };

  const getEventsByCategory = (category: string) => {
    return events.filter(event => event.category.toLowerCase() === category.toLowerCase());
  };

  const getEventsByClub = (clubId: string) => {
    return events.filter(event => event.clubId === clubId);
  };

  const getUserRegistrations = (userId: string) => {
    return registrations.filter(reg => reg.userId === userId);
  };

  const searchEvents = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.category.toLowerCase().includes(lowercaseQuery) ||
      event.venue.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <EventContext.Provider value={{
      events,
      clubs,
      registrations,
      addEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      getEventsByCategory,
      getEventsByClub,
      getUserRegistrations,
      searchEvents,
      isLoading
    }}>
      {children}
    </EventContext.Provider>
  );
};