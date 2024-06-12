const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: path.join(__dirname, '../logs/app.log') })
    ]
});

logger.stream = {
    write: (message) => logger.info(message.trim())
};

module.exports = logger;
