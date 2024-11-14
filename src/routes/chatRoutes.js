const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Ruta para manejar el chat
router.post('/message', chatController.handleChat);

module.exports = router;