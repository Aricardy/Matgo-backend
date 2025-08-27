import scanCountsRoutes from './routes/scanCounts.js';
// ...existing code...
import routePricesRoutes from './routes/routePrices.js';
// Route prices (dynamic fare lookup)
// (app.use is placed after app is initialized below)
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './config/db.js';

dotenv.config();

import tripsRoutes from "./routes/trips.js";
import matatusRoutes from "./routes/matatus.js";
import bookingsRoutes from "./routes/bookings.js";
import passengerRoutes from './routes/passengerRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
// import authAltRoutes from "./routes/auth.js";
import authRoutes from './routes/authRoutes.js';
import bookingAltRoutes from './routes/booking.js';
import adminRoutes from './routes/admin.js';
import saccoAdminRoutes from './routes/sacco_admin.js';
import featuredMatatusRoutes from './routes/featuredMatatus.js';
import approvalsRoutes from './routes/approvals.js';
import auditLogsRoutes from './routes/audit-logs.js';
import maintenanceRoutes from './routes/maintenance.js';
import personnelRoutes from './routes/personnel.js';
import adminProfileRoutes from './routes/adminProfile.js';
import reportsRoutes from './routes/reports.js';
import systemHealthRoutes from './routes/systemHealth.js';
import usersRoutes from './routes/users.js';
import routesRoutes from './routes/routes.js';
import statsRoutes from './routes/statsRoutes.js';
import paymentsRoutes from './routes/payments.js';
import longDistanceRoutes from './routes/long-distance.js';

const app = express();

// Set up middleware first
app.use(cors({
  origin: [
    'https://matgo-2-0-kfui.vercel.app', // production frontend
    'http://localhost:9002' // local dev
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Set up routes
app.use('/api/route-prices', routePricesRoutes);
app.use('/api/matatus', matatusRoutes);
app.use('/api/long-distance', longDistanceRoutes);
app.use('/uploads', express.static('uploads'));

// Auth routes first
app.use('/api/auth', authRoutes);

// Payments route
app.use('/api/payments', paymentsRoutes);

// Admin routes
app.use('/api/admin/approvals', approvalsRoutes);
app.use('/api/admin/audit-logs', auditLogsRoutes);
app.use('/api/admin/maintenance', maintenanceRoutes);
app.use('/api/admin/personnel', personnelRoutes);
app.use('/api/admin/profile', adminProfileRoutes);
app.use('/api/admin/reports', reportsRoutes);
app.use('/api/admin/system-health', systemHealthRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/admins', adminRoutes);

// Sacco admin routes
app.use('/api/sacco-admin', saccoAdminRoutes);

// User management routes
app.use('/api/passengers', passengerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/users', usersRoutes);

// Transportation routes
app.use('/api/matatus/featured', featuredMatatusRoutes);
app.use('/api/matatus', matatusRoutes);
app.use('/api/trips', tripsRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/routes', routesRoutes);

// Booking routes
app.use('/api/bookings', bookingsRoutes);
app.use('/api/booking', bookingAltRoutes);

// Stats routes
app.use('/api/stats', statsRoutes);

// Sacco routes (using sacco_admin routes for now)
app.use('/api/saccos', saccoAdminRoutes);

// Reports routes (redirect to admin reports for compatibility)
app.use('/api/reports', reportsRoutes);

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS currentTime');
    res.json({ success: true, currentTime: rows[0].currentTime });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Matgo API',
    version: '1.0.0',
    endpoints: '/api'
  });
});

// Add a catch-all route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Start the server after checking database connection
const startServer = async () => {
  try {
    console.log('🔍 Checking database connection...');
    // Test database connection
    const [result] = await db.query('SELECT 1');
    if (result) {
      console.log('✅ Database connected successfully');
    }
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      const address = server.address();
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
      console.log(`🌐 Server bound to:`, address);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Could not connect to the database. Make sure your database is running and credentials are correct.');
    }
    process.exit(1);
  }
};

console.log('🚀 Starting server...');
startServer();
