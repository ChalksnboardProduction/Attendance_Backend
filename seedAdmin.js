const bcrypt = require('bcryptjs');
const User = require('./models/User');
const sequelize = require('./database/db');
require('dotenv').config();

const ADMIN_PHONE = '7004677366';
const ADMIN_PASS = '1123456';
const ADMIN_NAME = 'System Admin';

async function seedAdmin() {
    try {
        // Ensure DB connection
        await sequelize.authenticate();

        const existingAdmin = await User.findOne({ where: { phone: ADMIN_PHONE } });

        if (existingAdmin) {
            console.log('✅ Admin already exists.');
        } else {
            const hashedPassword = await bcrypt.hash(ADMIN_PASS, 10);
            await User.create({
                name: ADMIN_NAME,
                phone: ADMIN_PHONE,
                password: hashedPassword,
                role: 'ADMIN'
            });
            console.log('✅ Admin account created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
