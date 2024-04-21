const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    name: String,
    image: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chatHistory: [{ message: String, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
