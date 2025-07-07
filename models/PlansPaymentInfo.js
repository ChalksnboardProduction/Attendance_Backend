const mongoose = require('mongoose');

const plansPaymentInfoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String
  },
  orderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'created'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  email: {
    type: String
  },
  phone_number: {
    type: String
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PlansPaymentInfo', plansPaymentInfoSchema); 