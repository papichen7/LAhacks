const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    image: String,
    info: String,
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
