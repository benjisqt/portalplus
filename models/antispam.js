const { model, Schema } = require('mongoose');

module.exports = model('antispam', new Schema({
    Guild: String,
    Exceptions: Array,
}))