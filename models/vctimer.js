const mongoose = require('mongoose');

module.exports = mongoose.model('vctimer', new mongoose.Schema({
    Guild: String,
    Channels: Array,
}))