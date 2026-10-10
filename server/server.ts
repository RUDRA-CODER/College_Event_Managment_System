import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
import coordinatorRoutes from './routes/coordinatorRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentRoutes';
import passwordRoutes from './routes/passwordRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CKPCET Event Management API is running'
  });
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Auth Routes
app.use('/api/auth/student', studentRoutes);
app.use('/api/auth/password', passwordRoutes);

// Coordinator Routes
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/auth/coordinator', coordinatorRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});