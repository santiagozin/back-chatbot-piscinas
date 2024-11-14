// src/models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userEmail: {
    type: String,
    required: true
  },
  messages: [{
    content: String,
    isBot: Boolean,
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Chat', chatSchema);
