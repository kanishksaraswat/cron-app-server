// controllers/cronJobController.js
const CronJob = require('../models/CronJob');
const { scheduleJob, unscheduleJob } = require('../utils/scheduler');

exports.createCronJob = async (req, res) => {
    const { name, url, schedule } = req.body;
    const job = new CronJob({ name, url, schedule, createdBy: req.user.id });
    await job.save();
    if (job.status === 'active') {
        scheduleJob(job);
    }
    res.status(201).send(job);
};

exports.getCronJobs = async (req, res) => {
    const jobs = await CronJob.find({ createdBy: req.user.id });
    res.send(jobs);
};

exports.updateCronJob = async (req, res) => {
    const { id } = req.params;
    const { name, url, schedule, status } = req.body;
    const job = await CronJob.findOneAndUpdate({ _id: id, createdBy: req.user.id }, { name, url, schedule, status }, { new: true });
    if (!job) {
        return res.status(404).send('Job not found');
    }
    unscheduleJob(id);
    if (job.status === 'active') {
        scheduleJob(job);
    }
    res.send(job);
};

exports.deleteCronJob = async (req, res) => {
    const { id } = req.params;
    const job = await CronJob.findOneAndDelete({ _id: id, createdBy: req.user.id });
    if (!job) {
        return res.status(404).send('Job not found');
    }
    unscheduleJob(id);
    res.send('Job deleted');
};
