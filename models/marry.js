const { model, Schema } = require('mongoose');

module.exports = model('marry', new Schema({
    Users: Array,
    Guild: String,
    MarryDate: Date,
}))