const { model, Schema } = require('mongoose');

module.exports = model('punishments', new Schema({
    Guild: String,
    User: String,
    Moderator: String,
    Punishment: String,
    DateTimePunish: Date,
    DateTimePunishMS: String,
    Time: String,
    Reason: String,
}))