import { Request, Response } from 'express';
import NotificationService from '../services/notificationService';

class NotificationsController {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    public sendEventReminder = async (req: Request, res: Response): Promise<void> => {
        const { userId, eventId } = req.body;
        try {
            await this.notificationService.sendReminder(userId, eventId);
            res.status(200).json({ message: 'Reminder sent successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error sending reminder', error });
        }
    };

    public sendDiscussionNotification = async (req: Request, res: Response): Promise<void> => {
        const { userId, discussionId } = req.body;
        try {
            await this.notificationService.sendDiscussionNotification(userId, discussionId);
            res.status(200).json({ message: 'Discussion notification sent successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error sending discussion notification', error });
        }
    };
}

export default NotificationsController;