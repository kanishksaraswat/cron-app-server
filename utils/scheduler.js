// utils/scheduler.js
const cron = require('node-cron');
const axios = require('axios');
const CronJob = require('../models/CronJob');
const logger = require('./logger');

const scheduledJobs = {};

function scheduleJob(job) {
    if (job.status !== 'active') return;

    if (scheduledJobs[job._id]) {
        scheduledJobs[job._id].stop();
    }

    const scheduledJob = cron.schedule(job.schedule, async () => {
        try {
            await axios.get(job.url);
            logger.info(`Job for ${job.url} executed at ${new Date().toLocaleString()}`);
        } catch (error) {
            logger.error(`Failed to execute job for ${job.url}: ${error.message}`);
        }
        job.lastRun = new Date();
        await job.save();
    });

    scheduledJobs[job._id] = scheduledJob;
}

function unscheduleJob(jobId) {
    if (scheduledJobs[jobId]) {
        scheduledJobs[jobId].stop();
        delete scheduledJobs[jobId];
    }
}

module.exports = { scheduleJob, unscheduleJob };
