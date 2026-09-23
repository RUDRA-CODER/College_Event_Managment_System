import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes';
import registrationRoutes from './routes/registrationRoutes';
import coordinatorRoutes from './routes/coordinatorRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

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

// Coordinator Routes
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/auth/coordinator', coordinatorRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
