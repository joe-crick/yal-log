var messageLevel = require('./messageLevel.js'),
  origConErr = console.error,
  origConWarn = console.warn,
  origConInfo = console.info,
  _ = require('lodash');

/**
 * @module {Function} api.utils.logging.consoleHandler consoleHandler
 * @parent api.utils.logging
 * @description Initializer for the console handler, returns the console handler function
 *
 * @param log
 * @returns {Function}
 */
function attachToConsole(log) {
  'use strict';

  console.error = function () {
    log({args: arguments, level: messageLevel.ERROR});
  };
  console.warn = function () {
    log({args: arguments, level: messageLevel.WARN});
  };
  console.info = function () {
    log({args: arguments, level: messageLevel.INFO});
  };

}

/**
 * @module {Function} api.utils.logging.consoleHandler consoleHandler
 * @parent api.utils.logging
 * @description A logging handler that raises writes log messages to the browser console.
 *
 *
 * @param logData
 */
function consoleHandler(logData) {
  'use strict';

  var consoleArgs = logData.hasOwnProperty('args') ? logData.args : logData.hasOwnProperty('logEntry') ? [logData.logEntry] : arguments;

  switch (logData.level) {
    case messageLevel.ERROR:
      origConErr.apply(console, consoleArgs);
      break;
    case messageLevel.WARN:
      origConWarn.apply(console, consoleArgs);
      break;
    case messageLevel.INFO:
      origConInfo.apply(console, consoleArgs);
      break;
    default:
      throw new Error('Invalid log level defined');
  }
}

module.exports = {
  consoleHandler: consoleHandler,
  attachToConsole: attachToConsole
};
