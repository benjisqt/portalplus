const { model, Schema } = require('mongoose');

module.exports = model('youtubenotifs', new Schema({
    Guild: String,
    Channel: String,
}))