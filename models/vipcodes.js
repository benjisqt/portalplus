const { model, Schema } = require('mongoose');

module.exports = model('vipcodes', new Schema({
    Length: String,
    Code: String,
}))