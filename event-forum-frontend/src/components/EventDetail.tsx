import React from 'react';

interface EventDetailProps {
    event: {
        id: string;
        title: string;
        description: string;
        date: string;
        location: string;
        organizer: string;
    };
    onRegister: (eventId: string) => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onRegister }) => {
    return (
        <div className="event-detail">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Organizer:</strong> {event.organizer}</p>
            <button onClick={() => onRegister(event.id)}>Register</button>
        </div>
    );
};

export default EventDetail;