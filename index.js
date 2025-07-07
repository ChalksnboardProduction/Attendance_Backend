const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute');
const cartRoute = require('./routes/cartRoute');
const categoryRoute = require('./routes/categoryRoute');
const paymentRoute = require('./routes/paymentRoute');

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
app.use('/product', productRoute);
app.use('/order', orderRoute);
app.use('/cart', cartRoute);
app.use('/category', categoryRoute);
app.use('/payment', paymentRoute);

const PORT = process.env.SERVER_PORT || 8000;

try {
    // await Load_Schemas();
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running at PORT ${PORT}`);
        // console.log(`Docs available at http://localhost:${PORT}/api-docs`)
    });
} catch (error) {
    console.log("❌ =====================> Error: ", error);
    process.exit(1);
}