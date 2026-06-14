const mongoose = require('mongoose');
const urlSchema = mongoose.Schema({
    shortID: {
        type: String,
        unique: true, 
        required: true
    },
    redirectURL: {
        type: String, 
        required: true
    },
    visitHistory: [{timestamps: {type: Number}}]
})
const URL = mongoose.model('URL', urlSchema);

module.exports = URL;