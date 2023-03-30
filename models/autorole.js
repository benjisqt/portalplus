const { model, Schema } = require('mongoose');

module.exports = model('autorole', new Schema({
    Guild: String,
    Role: String,
}))