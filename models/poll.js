const { model, Schema } = require('mongoose');

module.exports = model('poll', new Schema({
    Guild: String,
    Message: String,
    UpvoteMembers: Array,
    DownvoteMembers: Array,
    Upvotes: Number,
    Downvotes: Number,
    Owner: String,
    Topic: String,
}))