const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    user_id: {
        type: String
    },
    salary: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('Salary', UserSchema);