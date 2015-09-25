var messageLevel = require('./messageLevel.js');

/*global window */

/**
 * @module {Function} api.utils.logging.globalHandler globalHandler
 * @parent api.utils.logging
 * @description Attaches an event to the window.onerror event, and calls the log method when an unhandled error
 * occurrs, passing in the error information to the logger.
 *
 * @param {Function} log the logger's log function.
 *
 */
module.exports = function (log) {
  'use strict';
  // Preserve any existing onerror functions defined
  var oldOnError = window.onerror;
  // Trap all errors globally
  // We add in the error object check for Safari, which doesn't provide the error object to the onerror method.
  window.onerror = function (msg, url, line, col, error) {
    if (oldOnError) {
      oldOnError.apply(this, arguments);
    }

    log(
      {
        message: error ? msg : msg + '; url: ' + url + ', line: ' + line + ', col: ' + col,
        level: messageLevel.ERROR
      },
      error ? error : new Error());
  };
};
