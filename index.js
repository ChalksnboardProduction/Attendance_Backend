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

// If you add Swagger later, uncomment below:
// const { swaggerUi, swaggerSpec } = require('./swagger');

dotenv.config();
const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// If you add Swagger later, uncomment below:
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/user', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/category', categoryRoute);
app.use('/payment', paymentRoute);
app.use('/attendance', attendanceRoute);

const PORT = process.env.SERVER_PORT || 8000;

sequelize.sync({ alter: true }).then(async () => {
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

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running at PORT ${PORT}`);
    });
}).catch((error) => {
    console.log("❌ =====================> Error: ", error);
    process.exit(1);
});