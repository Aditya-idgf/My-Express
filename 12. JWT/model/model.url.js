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
    visitHistory: [{timestamps: {type: Number}}],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
})
const URL = mongoose.model('URL', urlSchema);

module.exports = URL;