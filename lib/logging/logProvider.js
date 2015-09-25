var messageLevel = require('./messageLevel.js');
var _ = require('lodash');
var moment = require('moment');

/*global location */

/**
 * @module {Function} api.utils.logging.logProvider logProvider
 * @parent api.utils.logging
 * @description A logging provider that produces a log entry object that can be consumed by log handlers.
 *
 * @param {Object} logData the log entry object returned by the logging provider.
 * @param {Object} errorObj an [optional] Error object instance.
 *
 */
module.exports = function (logData, errorObj) {
  'use strict';
  var stack;
  var logLevel = (logData.level || (errorObj ? messageLevel.ERROR : messageLevel.INFO));
  var message = (logData.message || ((errorObj && errorObj.message) ? errorObj.message : errorObj ? errorObj : ''));
  var host = location.hostname ;
  var logDate = moment().format();

  try {
    // Handle API errors
    if (errorObj && errorObj.hasOwnProperty('responseText')) {
      errorObj.stack = errorObj.responseText;
    }

    stack = errorObj && errorObj.hasOwnProperty('stack') ? errorObj.stack : '';

    return [
      _.assign({}, logData, {
        logEntry: '  date: ' + logDate +
        ' | level: ' + logLevel +
        ' | host: ' + host +
        ' | message: ' + message +
        (stack !== '' ? ' | stack_trace: ' + stack : ''),
        stack: stack
      }),
      errorObj
    ];

  } catch (e) {
    // Ignore errors here
  }
};
