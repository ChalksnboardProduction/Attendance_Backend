// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Plans_Payment_Info = require('../models/PlansPaymentInfo');
const dotenv = require('dotenv');
const sequelize = require('../database/db');
const { QueryTypes } = require('sequelize');

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const makePayment = async (req, res) => {
  try {
    const { amount, currency = 'INR', email, phone_number, user_id, name } = req.body;

    //                             =========> amount = ",amount)

    // console.log("=========================> inside makepayment and req,body = ", req.body)

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: email,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    const paymentRecord = await Plans_Payment_Info.create({
      user_id,
      name,
      orderId: order.id,
      paymentId: null, // pending at this point
      status: order.status,
      amount,
      currency,
      email,
      phone_number
    });

    // console.log("====================> success from backend")

    res.status(200).json({
      success: true,
      order,
      paymentRecordId: paymentRecord.id
    });

  } catch (error) {
    // console.error('==========================> Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// ========================================================================================================================================================================

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }

    const [affectedCount] = await Plans_Payment_Info.update(
      {
        paymentId: razorpay_payment_id,
        status: 'success'
      },
      {
        where: { orderId: razorpay_order_id }
      }
    );

    if (affectedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order ID not found in database'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and updated successfully'
    });

  } catch (error) {
    // console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

// ========================================================================================================================================================================

const paymentHistory = async (req, res) => {
  try {
    const { id } = req.body;

    const query = 'SELECT "orderId", "paymentId", amount, currency, "paymentDate", status FROM "PlansPaymentInfo" WHERE user_id = :id ORDER BY "paymentDate" DESC';

    const result = await sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });

    return res.status(200).json({
      data: result,
      message: 'Data fetched successfully',
    });

  } catch (error) {
    // console.error('Error fetching payment history:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};


// ===================================================================================================================================================================

module.exports = {
  makePayment,
  verifyPayment,
  paymentHistory
};