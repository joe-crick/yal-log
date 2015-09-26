'use strict';
var assert = require('assert');
var yalLog = require('../lib/index.js');

describe('Logger', function () {

    var testSetOne, testSetTwo;
    var mockLogProvider = function (logData) {
        logData.message = 'Mock Provider';
        return logData;
    };

    beforeEach(function () {
        testSetOne = {};
        testSetTwo = {};
    });

    var setOne = function (logData, error) {
        testSetOne.message = logData.message + '; setOne';
        testSetOne.error = error ? error.stack : '';
        testSetOne.level = logData.level;
    };
    var setTwo = function (logData) {
        testSetTwo.message = logData.message + '; setTwo';
        testSetTwo.level = logData.level;
    };


    it('runs all the handlers assigned to it', function () {
        var log = yalLog({handlers: [setOne, setTwo]});
        log.log({message: 'Oops', title: 'Warn', level: yalLog.messageLevel.WARN});

        expect(testSetOne.message).toContain('; setOne');
        expect(testSetTwo.message).toContain('; setTwo');
    });


    it('can use a provider provided to it', function () {
        var log = yalLog({handlers: [setTwo], loggingProvider: mockLogProvider});
        log.log({message: 'Oops', title: 'Warn', level: yalLog.messageLevel.WARN});

        expect(testSetTwo.message).toContain('Mock');
    });

    it('can have multiple instances', function () {
        var log = yalLog({handlers: [setTwo], loggingProvider: mockLogProvider});
        var log2 = yalLog({handlers: [setOne]});
        log.log({message: 'Oops', title: 'Warn', level: yalLog.messageLevel.WARN});
        log2.log({message: 'Whoops', level: yalLog.messageLevel.WARN});

        expect(testSetOne.message).toContain('Whoops');
        expect(testSetTwo.message).toContain('Mock');
    });

    it('runs the the error convenience method', function () {
        var log = yalLog({handlers: [setOne]});
        log.error('Oops', {stack: 'My Error Stack'});

        expect(testSetOne.message).toContain('Oops');
        expect(testSetOne.error).toContain('My Error Stack');
        expect(testSetOne.level).toBe(yalLog.messageLevel.ERROR);
    });

    it('runs the the warn convenience method', function () {
        var log = yalLog({handlers: [setOne]});
        log.warn('Oops');

        expect(testSetOne.message).toContain('Oops');
        expect(testSetOne.level).toBe(yalLog.messageLevel.WARN);
    });

    it('runs the the info convenience method', function () {
        var log = yalLog({handlers: [setOne]});
        log.info('Oops');

        expect(testSetOne.message).toContain('Oops');
        expect(testSetOne.level).toBe(yalLog.messageLevel.INFO);
    });

});
