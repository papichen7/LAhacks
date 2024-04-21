const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

router.get('/', async (req, res) => {
    try {
        const conversations = await Conversation.find();
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, image, users, chatHistory } = req.body;
    const conversation = new Conversation({
        name,
        image,
        users,
        chatHistory
    });

    try {
        const newConversation = await conversation.save();
        res.status(201).json(newConversation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', getConversation, (req, res) => {
    res.json(res.conversation);
});

router.patch('/:id', getConversation, async (req, res) => {
    if (req.body.chatHistory != null) {
        res.conversation.chatHistory.push(req.body.chatHistory);
    }

    try {
        const updatedConversation = await res.conversation.save();
        res.json(updatedConversation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Middleware to fetch a conversation by ID
async function getConversation(req, res, next) {
    let conversation;
    try {
        conversation = await Conversation.findById(req.params.id);
        if (conversation == null) {
            return res.status(404).json({ message: `Cannot find conversation with ID ${req.params.id}` });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    res.conversation = conversation;
    next();
}

module.exports = router;
