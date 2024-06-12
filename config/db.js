const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Scheduler'
        });
        logger.info('MongoDB connected successfully');
    } catch (err) {
        logger.error('MongoDB connection failed', err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
