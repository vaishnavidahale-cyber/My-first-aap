import React, { useEffect, useState } from 'react';
import { Event, fetchEvents } from '../services/api';

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getEvents = async () => {
            try {
                const data = await fetchEvents();
                setEvents(data);
            } catch (err) {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, []);

    if (loading) {
        return <div>Loading events...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Upcoming Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <h3>{event.title}</h3>
                        <p>{event.date}</p>
                        <p>{event.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;