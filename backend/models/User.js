const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    image: String,
    info: String,
});

module.exports = mongoose.model('User', UserSchema);
