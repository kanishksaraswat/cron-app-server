const express = require('express');
const morgan = require('morgan');
const logger = require('./utils/logger');
const cronJobsRouter = require('./routes/cronJobs');
const userRouter = require('./routes/users');
const { errorHandler } = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const CronJob = require('./models/CronJob');
const { scheduleJob, keepServerAlive } = require('./utils/scheduler');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://cron-app-bice.vercel.app'],
    optionsSuccessStatus: 200
}));

// Log to console and log file
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/cron-jobs', cronJobsRouter);
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/health', (req, res) => res.send('OK'));

// Route to display logs
app.get('/logs', (req, res) => {
  fs.readFile(path.join(__dirname, 'access.log'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading log file');
    } else {
      res.type('text/plain').send(data);
    }
  });
});

// Route to keep the server alive
app.get('/keep-alive', (req, res) => {
    res.send('Server is alive');
});

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    startCronJobs();
    keepServerAlive();
});

// Function to start all active cron jobs
async function startCronJobs() {
    const jobs = await CronJob.find({ status: 'active' });
    jobs.forEach(job => {
        scheduleJob(job);
    });
}

module.exports = app;
