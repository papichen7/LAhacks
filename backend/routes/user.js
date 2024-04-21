const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Route to get a specific user by ID
router.get('/:id', getUser, (req, res) => {
    res.json(res.user); 
});

// Middleware to fetch a user by ID
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id); 
        if (user == null) {
            return res.status(404).json({ message: `Cannot find user with ID ${req.params.id}` });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message }); 
    }
    res.user = user; 
    next(); 
}

module.exports = router;
