const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    email: { type: String, required: true },
    tokenExpiry: { type: Date, required: true },
    token: { type: String, required: true }
}, { collection: 'logs' });

module.exports = mongoose.model('Log', logSchema);
