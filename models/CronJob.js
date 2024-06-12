const mongoose = require('mongoose');

const CronJobSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    schedule: { type: String, required: true },
    lastRun: { type: Date },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('CronJob', CronJobSchema);
