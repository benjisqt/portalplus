const { model, Schema } = require('mongoose');

module.exports = model('welcomechannel', new Schema({
    Guild: String,
    Channel: String,
    Message: String,
}))