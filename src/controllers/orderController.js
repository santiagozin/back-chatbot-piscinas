// src/controllers/orderController.js
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

exports.createOrder = async (req, res) => {
  try {
    const { userEmail, userName, products } = req.body;
    
    const order = new Order({
      user: {
        email: userEmail,
        name: userName
      },
      products
    });

    await order.save();

    // Enviar email de confirmación
    await sendOrderConfirmation(order);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkNotifications = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const orders = await Order.find({
    createdAt: { $lte: thirtyDaysAgo },
    lastNotification: null
  });

  for (const order of orders) {
    await sendRepurchaseReminder(order);
    order.lastNotification = new Date();
    await order.save();
  }
};
