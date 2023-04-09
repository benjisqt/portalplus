const { model, Schema } = require('mongoose');

module.exports = model('caprisun', new Schema({
    Guild: String,
    User: String,
    Capri: String,
}))