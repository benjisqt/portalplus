const { model, Schema } = require('mongoose');

module.exports = model('capslimit', new Schema({
    Guild: String,
    CapsLimit: Number,
}))