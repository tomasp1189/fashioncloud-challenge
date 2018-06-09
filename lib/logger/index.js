var winston = require('winston');
winston.emitErrs = true;

winston.remove(winston.transports.Console);

winston.add(winston.transports.File, {
	name: 'info-level',
	level: 'info',
	filename: 'logs/all-logs.log',
	handleExceptions: true,
	json: true,
	maxsize: 5242880, //5MB
	maxFiles: 5,
	colorize: false
});
winston.add(winston.transports.File, {
	name: 'error-level',
	level: 'error',
	filename: 'logs/error-logs.log',
	handleExceptions: true,
	json: true,
	maxsize: 5242880, //5MB
	maxFiles: 5,
	colorize: false
});
winston.add(winston.transports.Console, {
	name: 'debug-level',
	level: 'debug',
	handleExceptions: true,
	json: false,
	colorize: true
});
winston.exitOnError = false;

module.exports = winston;
