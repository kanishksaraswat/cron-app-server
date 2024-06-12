const express = require('express');
const morgan = require('morgan');
const logger = require('./utils/logger');
const cronJobsRouter = require('./routes/cronJobs');
const userRouter = require('./routes/users');
const { errorHandler } = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const CronJob = require('./models/CronJob');
const { scheduleJob } = require('./utils/scheduler');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// app.use(morgan('combined', { stream: logger.stream }));
const corsOptions = {
    origin: ['https://cron-app-bice.vercel.app/'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/cron-jobs', cronJobsRouter);
app.use('/api/users', userRouter);

// Health check endpoint
app.get('/health', (req, res) => res.send('OK'));

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    startCronJobs();
});

// Function to start all active cron jobs
async function startCronJobs() {
    const jobs = await CronJob.find({ status: 'active' });
    jobs.forEach(job => {
        scheduleJob(job);
    });
}

module.exports = app;
