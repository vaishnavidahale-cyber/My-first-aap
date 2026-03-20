import React, { useState } from 'react';

const EventUpload: React.FC = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventName || !eventDate || !eventDescription) {
            setError('All fields are required.');
            return;
        }
        setError('');
        // Call API to upload event details
        // Example: api.uploadEvent({ eventName, eventDate, eventDescription });
        console.log('Event submitted:', { eventName, eventDate, eventDescription });
    };

    return (
        <div>
            <h2>Upload New Event</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Event Name:</label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Event Date:</label>
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Event Description:</label>
                    <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EventUpload;