const { model, Schema } = require('mongoose');

module.exports = model('memberCounter', new Schema({
    Guild: String,
    Channel: String,
    Members: Number
}))