const { model, Schema } = require('mongoose');

module.exports = model('temprole', new Schema({
    Guild: String,
    User: String,
    Role: String,
    Expiry: Date,
    Moderator: String,
    Duration: String,
}))