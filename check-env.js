const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🔍 Environment Variables Check:');
console.log('================================');

// Database variables
console.log('📊 Database Configuration:');
console.log('DB_NAME:', process.env.DB_NAME || '❌ NOT SET');
console.log('DB_USERNAME:', process.env.DB_USERNAME || '❌ NOT SET');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ SET' : '❌ NOT SET');
console.log('DB_HOST:', process.env.DB_HOST || '❌ NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || '❌ NOT SET');

console.log('\n🔐 JWT Configuration:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');

console.log('\n💳 Razorpay Configuration:');
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || '❌ NOT SET');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ SET' : '❌ NOT SET');

console.log('\n🌐 Server Configuration:');
console.log('PORT:', process.env.PORT || '❌ NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NOT SET');

console.log('\n📁 .env file location:', require('path').resolve('.env'));
console.log('================================'); 