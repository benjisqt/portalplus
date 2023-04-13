const { model, Schema } = require('mongoose');

module.exports = model('boost', new Schema({
    Guild: String,
    Channel: String,
}))