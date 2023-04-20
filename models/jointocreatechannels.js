const { model, Schema } = require('mongoose');

module.exports = model('jointocreatechannels', new Schema({
    Guild: String,
    User: String,
    Channel: String,
}))