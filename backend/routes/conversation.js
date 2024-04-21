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
    const { name, image, users } = req.body;
    try {
        const populatedUsers = await User.find({ '_id': { $in: users.map(user => user._id) } });
        const newConversation = new Conversation({
            name,
            image,
            users: populatedUsers, // This assumes that your Conversation model expects full user objects in the users array
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
