const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const User = require('../models/User')

router.get('/', async (req, res) => {
    try {
        const conversations = await Conversation.find();
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Assuming you have a POST route for '/conversation'
router.post('/', async (req, res) => {
    const { name, image, users, chatHistory } = req.body;
    try {
        const populatedUsers = await User.find({ '_id': { $in: users.map(user => user._id) } });
        const newConversation = new Conversation({
            name,
            image,
            users: populatedUsers, // This assumes that your Conversation model expects full user objects in the users array
            chatHistory
        });
        await newConversation.save();
        res.status(201).json(newConversation);
    } catch (error) {
        console.error('Failed to create new conversation:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get('/:id', getConversation, (req, res) => {
    res.json(res.conversation);
});


router.patch('/:id', getConversation, async (req, res) => {
    const newEntry = req.body.chatHistory;

    // console.log(newEntry);

    if (newEntry) {
        // Ensure the newEntry contains all necessary fields and types
        if (typeof newEntry.message === 'string' &&
            typeof newEntry.name === 'string' &&
            typeof newEntry.image === 'string' &&
            typeof newEntry.position === 'boolean') {
            
            // Append the new message to the conversation history
            res.conversation.chatHistory.push({
                message: newEntry.message,
                name: newEntry.name,
                image: newEntry.image,
                position: newEntry.position
            });

            try {
                const updatedConversation = await res.conversation.save();
                res.json(updatedConversation);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        } else {
            res.status(400).json({ message: 'Invalid chat history entry' });
        }
    } else {
        res.status(400).json({ message: 'No chat history provided' });
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
