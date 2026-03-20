import { Event } from '../models/event';
import { User } from '../models/user';

export class ReminderService {
    private reminders: Map<string, NodeJS.Timeout> = new Map();

    scheduleReminder(event: Event, user: User, reminderTime: Date): void {
        const reminderId = `${event.id}-${user.id}`;
        const timeUntilReminder = reminderTime.getTime() - Date.now();

        if (timeUntilReminder > 0) {
            const timeout = setTimeout(() => {
                this.sendReminder(event, user);
                this.reminders.delete(reminderId);
            }, timeUntilReminder);

            this.reminders.set(reminderId, timeout);
        }
    }

    cancelReminder(event: Event, user: User): void {
        const reminderId = `${event.id}-${user.id}`;
        const timeout = this.reminders.get(reminderId);

        if (timeout) {
            clearTimeout(timeout);
            this.reminders.delete(reminderId);
        }
    }

    private sendReminder(event: Event, user: User): void {
        // Logic to send reminder notification to the user
        console.log(`Reminder for event: ${event.title} sent to user: ${user.username}`);
    }
}