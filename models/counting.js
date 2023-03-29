const { model, Schema } = require('mongoose');

module.exports = model('counting', new Schema({
    Guild: String,
    Channel: String,
    Number: Number,
}))