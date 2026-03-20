import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import clubRoutes from './routes/clubs';
import discussionRoutes from './routes/discussions';
import { config } from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/discussions', discussionRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});