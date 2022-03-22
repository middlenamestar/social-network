const { Schema, model } = require('mongoose');
const moment = require('moment');
const reaction = require('./reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatTimestamp
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reaction]
    },
    {
        toJSON: {
            virtuals: true,
          },
          id: false
    }
)

function formatTimestamp(createdAt) {
    moment(createdAt).format('l');
};

thoughtSchema
    .virtual('reactionCount')
    .get(function() {
        return reactions.length
    })

const thought = model('thought', thoughtSchema);

module.exports = thought;