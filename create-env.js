const fs = require('fs');
const path = require('path');

const envContent = `# Database Configuration
DB_NAME=gau_ecommerce
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Razorpay Configuration
# Get these from your Razorpay dashboard: https://dashboard.razorpay.com/
RAZORPAY_KEY_ID=rzp_test_your_test_key_id_here
RAZORPAY_KEY_SECRET=your_test_key_secret_here

# For production, use your live keys:
# RAZORPAY_KEY_ID=rzp_live_your_live_key_id_here
# RAZORPAY_KEY_SECRET=your_live_key_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the following values in your .env file:');
  console.log('   - DB_PASSWORD: Your MySQL password');
  console.log('   - RAZORPAY_KEY_ID: Your Razorpay Key ID');
  console.log('   - RAZORPAY_KEY_SECRET: Your Razorpay Key Secret');
  console.log('   - JWT_SECRET: A secure random string for JWT tokens');
} else {
  console.log('⚠️  .env file already exists!');
  console.log('📝 Please check and update the values if needed.');
} 