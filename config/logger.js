import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, json } = winston.format;

// Custom log format for console
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${stack || message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ''
  }`;
});

// Create rotating file transports
const authRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/auth/auth-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  level: 'info',
});

const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/error/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '90d',
  level: 'error',
});

const combinedRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/combined/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  transports: [
    authRotateTransport,
    errorRotateTransport,
    combinedRotateTransport,
  ],
});

// Always log to console in development, or minimally in production
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp({ format: 'HH:mm:ss' }), consoleFormat),
    })
  );
} else {
  // In production we still want critical errors hitting the native console (e.g. Docker logs)
  logger.add(
    new winston.transports.Console({
      level: 'error',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), consoleFormat),
    })
  );
}

// Custom specialized loggers for convenience
export const authLogger = {
  info: (msg, meta) => logger.info(msg, { context: 'AUTH', ...meta }),
  warn: (msg, meta) => logger.warn(msg, { context: 'AUTH', ...meta }),
  error: (msg, meta) => logger.error(msg, { context: 'AUTH', ...meta }),
};

export const apiLogger = {
  info: (msg, meta) => logger.info(msg, { context: 'API', ...meta }),
  warn: (msg, meta) => logger.warn(msg, { context: 'API', ...meta }),
  error: (msg, meta) => logger.error(msg, { context: 'API', ...meta }),
};

export default logger;
