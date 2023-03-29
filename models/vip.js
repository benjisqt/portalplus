const { model, Schema } = require('mongoose');

module.exports = model('vips', new Schema({
    Guild: String,
    Expires: Date,
    User: String,
    Code: String,
    Duration: String,
}))