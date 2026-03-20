import { Request, Response } from 'express';
import Event from '../models/event';

class EventsController {
    async createEvent(req: Request, res: Response) {
        try {
            const { title, date, time, venue, description, poster, rules, contactInfo } = req.body;
            const newEvent = new Event({ title, date, time, venue, description, poster, rules, contactInfo });
            await newEvent.save();
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(500).json({ message: 'Error creating event', error });
        }
    }

    async getEvents(req: Request, res: Response) {
        try {
            const events = await Event.find();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving events', error });
        }
    }

    async updateEvent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ message: 'Error updating event', error });
        }
    }

    async deleteEvent(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedEvent = await Event.findByIdAndDelete(id);
            if (!deletedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting event', error });
        }
    }

    async getEventById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving event', error });
        }
    }
}

export default new EventsController();