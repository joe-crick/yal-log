var messageLevel = require('./logging/messageLevel.js');
var defaultLogProvider = require('./logging/logProvider');
var globalErrorHandling = require('./logging/attachToGlobal');
var consoler = require('./logging/consoler');
var _ = require('lodash');

function getLogData(logData) {
    'use strict';
    return typeof logData === 'string' ? {message: logData} : logData;
}

/**
 * @module {Function} api.utils.logger logger
 * @parent api.utils
 * @description A utility that provides modular logging capabilities. Several logging handler modules are provided by default:
 *    - alertHandler: sends the logging message to a Sheriff or Nemo alert
 *    - consolHandler: sends the logging message to the browser console
 *
 * In addition, the utility provides the ability to attach to the global onerror function to log all unhandled
 * errors.
 *
 * Finally, the logger comes configured with a default log provider that manages the formatting of log entries. Users can
 * provide their own logging provider that can override this format.
 *
 *
 * @param conf A configuration object, which contains the hanlders array, isGlobal, isConsole, and logProvider arguments
 */
var logger = function (conf) {
    var handlers = conf.handlers,
        attachToGlobal = conf.attachToGlobal,
        attachToConsole = conf.attachToConsole,
        loggingProvider = conf.loggingProvider,
        logProvider = loggingProvider || defaultLogProvider;

	/**
     * @description Log an event
     */
    function log() {
        var logData = logProvider.apply(this, arguments);
        for (var i = 0; i < handlers.length; i++) {
            if (Array.isArray(logData)) {
                handlers[i].apply(this, logData);
            } else {
                handlers[i].call(this, logData);
            }
        }
    }

    if (attachToGlobal) {
        globalErrorHandling(log);
    }

    if (attachToConsole) {
        consoler.attachToConsole(log);
    }

    return {
        log: log,
        // Default convenience methods. They must stipulate some format to be meaningful.
        // Can take either an object, or a string. If a string, then will append the message level
        // to the params sent to the log call.
        error: function (logData, error) {
            this.log(_.assign({}, getLogData(logData), {level: messageLevel.ERROR}), error);
        },
        warn: function (logData) {
            this.log(_.assign({}, getLogData(logData), {level: messageLevel.WARN}));
        },
        info: function (logData) {
            this.log(_.assign({}, getLogData(logData), {level: messageLevel.INFO}));
        }
    };
};

logger.messageLevel = messageLevel;
logger.defaultLogProvider = defaultLogProvider;
logger.consoleHandler = consoler.consoleHandler;

module.exports = logger;
