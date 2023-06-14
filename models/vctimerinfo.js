const mongoose = require('mongoose');

module.exports = mongoose.model('vctimerinfo', new mongoose.Schema({
    Guild: String,
    Channel: String,
    Duration: String,
    ChannelName: String,
}))