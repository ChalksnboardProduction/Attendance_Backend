const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const categoryRoute = require('./routes/categoryRoute');
const paymentRoute = require('./routes/paymentRoute');

module.exports = function(app) {
  app.use('/user', userRoute);
  app.use('/products', productRoute);
  app.use('/cart', cartRoute);
  app.use('/category', categoryRoute);
  app.use('/payment', paymentRoute);
};
