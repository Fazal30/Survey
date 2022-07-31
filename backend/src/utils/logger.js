const winston = require('winston');

const errorStackFormat = winston.format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message,
    };
  }
  return info;
});

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    errorStackFormat(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] ${info.level}: ${info.message} ${
          info.stack ? `\n${info.stack}` : ''
        }`,
    ),
  ),
  transports: [],
});

if (process.env.NODE_ENV !== 'test') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/debug.log',
      level: 'debug',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'info',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/warn.log',
      level: 'warn',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
}

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        errorStackFormat(),
        winston.format.splat(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(
          (info) =>
            `[${info.timestamp}] ${info.level} ${info.message} ${
              info.stack ? `\n${info.stack}` : ''
            }`,
        ),
      ),
    }),
  );
}

module.exports = logger;
