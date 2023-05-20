const { model, Schema } = require('mongoose');

module.exports = model('xp', new Schema({
    Guild: String,
    User: String,
    XP: Number,
    Level: Number,
    XPMultiplier: Number,
}))