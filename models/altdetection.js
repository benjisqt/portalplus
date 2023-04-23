const { model, Schema } = require('mongoose');

module.exports = model('altdetection', new Schema({
    Guild: String,
    Punishment: String,
}))