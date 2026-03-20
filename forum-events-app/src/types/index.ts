export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venue: string;
    posterUrl?: string;
    rules?: string[];
    contactInfo?: string;
    category: string;
    registrationLink?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    registeredEvents: string[];
    afterEventExperiences?: string[];
}

export interface Club {
    id: string;
    name: string;
    description: string;
    members: string[];
    events: string[];
}

export interface Poll {
    id: string;
    question: string;
    options: string[];
    responses: Record<string, number>;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    eventId?: string;
    createdAt: Date;
}

export interface Reminder {
    id: string;
    userId: string;
    eventId: string;
    reminderTime: Date;
}