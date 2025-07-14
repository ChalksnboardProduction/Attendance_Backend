# Environment Variables Setup

## Database Configuration

To fix the database connection error, you need to configure your MySQL database credentials.

## Razorpay Configuration

To fix the "key_id or oauthToken is mandatory" error, you need to configure your Razorpay credentials.

### Steps:

1. **Create a `.env` file** in the `Backend_Gau` directory
2. **Add the following content** to the `.env` file:

```env
# Database Configuration
DB_NAME=your_database_name
DB_USERNAME=your_mysql_username
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
```

### Database Setup:

1. **Install MySQL** if you haven't already
2. **Create a database** for your e-commerce application
3. **Create a MySQL user** with appropriate permissions
4. **Update the `.env` file** with your database credentials

#### Example MySQL commands:
```sql
-- Create database
CREATE DATABASE gau_ecommerce;

-- Create user (replace 'your_username' and 'your_password')
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON gau_ecommerce.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### How to get Razorpay credentials:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Go to **Settings** → **API Keys**
4. Generate a new key pair
5. Copy the **Key ID** and **Key Secret**
6. Replace the placeholder values in your `.env` file

### Test vs Live Keys:

- **Test Keys**: Start with `rzp_test_` - Use these for development and testing
- **Live Keys**: Start with `rzp_live_` - Use these for production

### Important Notes:

- The `.env` file is already in `.gitignore` to keep your credentials secure
- Never commit your actual API keys to version control
- The server will now start without crashing, but payment functionality will be disabled until you configure the credentials

### Testing the Setup:

1. **Test database connection** by running the server - it should connect without errors
2. **Test Razorpay** by making a test payment (only works after adding real credentials)
3. **Check the console** for any warning messages about missing configurations 