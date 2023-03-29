const { model, Schema } = require('mongoose');

module.exports = model('antijoin', new Schema({
    Guild: String,
    Enabled: Boolean,
    Punishment: String,
}))