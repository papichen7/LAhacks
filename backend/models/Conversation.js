const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    name: String,
    image: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Conversation = mongoose.model('Conversation', ConversationSchema, 'conversations');

module.exports = Conversation;
