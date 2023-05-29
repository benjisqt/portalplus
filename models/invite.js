const { model, Schema } = require('mongoose');

module.exports = model('invite', new Schema({
    Guild: String,
    Channel: String,
}))