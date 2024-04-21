const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    name: String,
    image: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chatHistory: [{ message: String, name: String, image: String, position: Boolean }]
});

const Conversation = mongoose.model('Conversation', ConversationSchema, 'conversations');

module.exports = Conversation;
