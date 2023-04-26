const { model, Schema } = require('mongoose');

module.exports = model('reminders', new Schema({
    Guild: String,
    User: String,
    Reminder: String,
    Remind: Date,
    RemindQuietly: String,
}))