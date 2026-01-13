const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./database/db');
const bcrypt = require('bcryptjs');

require('./models/Product');
require('./models/Cart');
require('./models/Category');
require('./models/User');
require('./models/Attendance');
require('./models/Payment');

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const categoryRoute = require('./routes/categoryRoute');
const paymentRoute = require('./routes/paymentRoute');
const attendanceRoute = require('./routes/attendanceRoutes');

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/user', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/category', categoryRoute);
app.use('/payment', paymentRoute);
app.use('/attendance', attendanceRoute);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Attendance System API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            user: '/user',
            products: '/products',
            cart: '/cart',
            category: '/category',
            payment: '/payment',
            attendance: '/attendance'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize database and seed admin
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established');
        
        // Sync models (use alter: false in production to avoid data loss)
        await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
        console.log('✅ Database models synced');

        // Seed Admin
        try {
            const User = require('./models/User');
            const ADMIN_PHONE = '7004677366';
            const existing = await User.findOne({ where: { phone: ADMIN_PHONE } });
            if (!existing) {
                const hashedPassword = await bcrypt.hash('1123456', 10);
                await User.create({
                    name: 'System Admin',
                    phone: ADMIN_PHONE,
                    password: hashedPassword,
                    role: 'ADMIN'
                });
                console.log('✅ Admin (7004677366) seeded.');
            }
        } catch (e) {
            console.error('⚠️ Admin seeding failed:', e.message);
        }
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        // Don't throw in serverless - just log the error
        if (process.env.VERCEL !== '1') {
            throw error;
        }
    }
}

// Initialize database (only once, not on every request)
let dbInitialized = false;
if (!dbInitialized) {
    initializeDatabase().catch(console.error);
    dbInitialized = true;
}

// For Vercel serverless: export the app
// For local development: start the server
if (process.env.VERCEL !== '1' && require.main === module) {
    const PORT = process.env.SERVER_PORT || 8000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running at PORT ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
