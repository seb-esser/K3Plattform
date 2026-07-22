const express = require('express');
const cors = require('cors');
const { uploadsDir } = require('./middleware/upload');
const authRoutes = require('./routes/auth.routes');
const eventsRoutes = require('./routes/events.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api', authRoutes);
app.use('/api', eventsRoutes);

app.use(errorHandler);

module.exports = app;
