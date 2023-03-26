const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    user_id: {
        type: String
    },
    food: {
        type: String,
    },
    fuel_office: {
        type: String,
    },
    loan: {
        type: String,
    },
    fuel_personal: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('Expanse', UserSchema);