import React, { useState } from 'react';

const Reminder: React.FC = () => {
    const [reminders, setReminders] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const handleAddReminder = () => {
        if (inputValue) {
            setReminders([...reminders, inputValue]);
            setInputValue('');
        }
    };

    const handleDeleteReminder = (index: number) => {
        const newReminders = reminders.filter((_, i) => i !== index);
        setReminders(newReminders);
    };

    return (
        <div>
            <h2>Event Reminders</h2>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a reminder"
            />
            <button onClick={handleAddReminder}>Add Reminder</button>
            <ul>
                {reminders.map((reminder, index) => (
                    <li key={index}>
                        {reminder}
                        <button onClick={() => handleDeleteReminder(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reminder;