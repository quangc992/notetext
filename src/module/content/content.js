const mongoose = require('mongoose')
const Schema = mongoose.Schema

const content = new Schema({
    nameID: {
        type: String,
        unique: true,
    },
    shareID: {
        type: String,
        unique: true,
    },
    content: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    timeExpire: {
        type: Date,
        default: function () {
            let date = new Date()
            date.setDate(date.getDate() + 60)
            return date
        }
    }
})

module.exports = mongoose.model('content', content)