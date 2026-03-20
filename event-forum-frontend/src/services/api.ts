import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

// Types
export interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    location?: string;
}

export interface CommunityPost {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    bio?: string;
}

export interface ReminderData {
    eventId: string;
    reminderTime: string;
    message: string;
}

export const fetchEvents = async (): Promise<Event[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error fetching events: ' + (error?.message || 'Unknown error'));
    }
};

export const fetchEventDetails = async (eventId: string): Promise<Event> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error fetching event details: ' + (error?.message || 'Unknown error'));
    }
};

export const uploadEvent = async (eventData: Omit<Event, 'id'>): Promise<Event> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/events`, eventData);
        return response.data;
    } catch (error: any) {
        throw new Error('Error uploading event: ' + (error?.message || 'Unknown error'));
    }
};

export const fetchReminders = async (): Promise<ReminderData[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reminders`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error fetching reminders: ' + (error?.message || 'Unknown error'));
    }
};

export const createReminder = async (reminderData: ReminderData): Promise<ReminderData> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reminders`, reminderData);
        return response.data;
    } catch (error: any) {
        throw new Error('Error creating reminder: ' + (error?.message || 'Unknown error'));
    }
};

export const updateReminder = async (reminderId: string, reminderData: Partial<ReminderData>): Promise<ReminderData> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/reminders/${reminderId}`, reminderData);
        return response.data;
    } catch (error: any) {
        throw new Error('Error updating reminder: ' + (error?.message || 'Unknown error'));
    }
};

export const deleteReminder = async (reminderId: string): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/reminders/${reminderId}`);
    } catch (error: any) {
        throw new Error('Error deleting reminder: ' + (error?.message || 'Unknown error'));
    }
};

// Community API functions
export const fetchCommunityPosts = async (): Promise<CommunityPost[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/community/posts`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error fetching community posts: ' + (error?.message || 'Unknown error'));
    }
};

// User Profile API functions
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error('Error fetching user profile: ' + (error?.message || 'Unknown error'));
    }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, profileData);
        return response.data;
    } catch (error: any) {
        throw new Error('Error updating user profile: ' + (error?.message || 'Unknown error'));
    }
};