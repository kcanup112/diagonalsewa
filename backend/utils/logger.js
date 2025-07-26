/**
 * Enhanced Logging System with Multiple Levels and Formatting
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...metadata
    };

    return JSON.stringify(logEntry) + '\n';
  }

  writeToFile(filename, content) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content);
  }

  info(message, metadata = {}) {
    const formatted = this.formatMessage('info', message, metadata);
    console.log(`ℹ️  ${message}`, metadata);
    this.writeToFile('app.log', formatted);
  }

  error(message, error = null, metadata = {}) {
    const errorData = error ? {
      error: {
        message: error.message,
        stack: error.stack,
        ...error
      }
    } : {};

    const formatted = this.formatMessage('error', message, { ...metadata, ...errorData });
    console.error(`❌ ${message}`, error);
    this.writeToFile('error.log', formatted);
  }

  warn(message, metadata = {}) {
    const formatted = this.formatMessage('warn', message, metadata);
    console.warn(`⚠️  ${message}`, metadata);
    this.writeToFile('app.log', formatted);
  }

  debug(message, metadata = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message, metadata);
      console.debug(`🐛 ${message}`, metadata);
      this.writeToFile('debug.log', formatted);
    }
  }

  http(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };

    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`;
    const formatted = this.formatMessage('http', message, logData);
    
    console.log(`🌐 ${message}`);
    this.writeToFile('access.log', formatted);
  }

  database(operation, table, metadata = {}) {
    const message = `Database ${operation} on ${table}`;
    const formatted = this.formatMessage('database', message, { operation, table, ...metadata });
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗄️  ${message}`, metadata);
    }
    this.writeToFile('database.log', formatted);
  }

  performance(operation, duration, metadata = {}) {
    const message = `Performance: ${operation} took ${duration}ms`;
    const formatted = this.formatMessage('performance', message, { operation, duration, ...metadata });
    
    if (duration > 1000) {
      console.warn(`⏱️  SLOW: ${message}`);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️  ${message}`);
    }
    
    this.writeToFile('performance.log', formatted);
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger;
