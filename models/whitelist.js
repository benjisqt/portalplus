const { model, Schema } = require('mongoose');

module.exports = model('whitelists', new Schema({
    Guild: String,
    Users: [],
}))