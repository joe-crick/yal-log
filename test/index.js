'use strict';
import assert from 'assert';
import yalLog from '../lib';

require('steal-jasmine');

var logger = require('pui/utils/logger');
var can = require('can');

describe('Logger', function () {

  var testSetOne, testSetTwo;
  var mockLogProvider = function(logData, error){
    logData.message = 'Mock Provider';
    return logData;
  };

  beforeEach(function(){
    testSetOne = {};
    testSetTwo = {};
  });

  var setOne = function(logData, error){
    testSetOne.message = logData.message + '; setOne';
    testSetOne.error = error ? error.stack : '';
    testSetOne.level = logData.level;
  };
  var setTwo = function(logData){
    testSetTwo.message = logData.message + '; setTwo';
    testSetTwo.level = logData.level;
  };


  it('runs all the handlers assigned to it', function () {
    var log = logger({handlers: [setOne, setTwo]});
    log.log({message: 'Oops', title: 'Warn', level: logger.messageLevel.WARN});

    expect(testSetOne.message).toContain('; setOne');
    expect(testSetTwo.message).toContain('; setTwo');
  });


  it('can use a provider provided to it', function () {
    var log = logger({handlers: [setTwo], loggingProvider: mockLogProvider});
    log.log({message: 'Oops', title: 'Warn', level: logger.messageLevel.WARN});

    expect(testSetTwo.message).toContain('Mock');
  });

  it('can have multiple instances', function () {
    var log = logger({handlers: [setTwo], loggingProvider: mockLogProvider});
    var log2 = logger({handlers: [setOne]});
    log.log({message: 'Oops', title: 'Warn', level: logger.messageLevel.WARN});
    log2.log({message: 'Whoops', level: logger.messageLevel.WARN});

    expect(testSetOne.message).toContain('Whoops');
    expect(testSetTwo.message).toContain('Mock');
  });

  it('runs the the error convenience method', function () {
    var log = logger({handlers: [setOne]});
    log.error('Oops', {stack: 'My Error Stack'});

    expect(testSetOne.message).toContain('Oops');
    expect(testSetOne.error).toContain('My Error Stack');
    expect(testSetOne.level).toBe(logger.messageLevel.ERROR);
  });

  it('runs the the warn convenience method', function () {
    var log = logger({handlers: [setOne]});
    log.warn('Oops');

    expect(testSetOne.message).toContain('Oops');
    expect(testSetOne.level).toBe(logger.messageLevel.WARN);
  });

  it('runs the the info convenience method', function () {
    var log = logger({handlers: [setOne]});
    log.info('Oops');

    expect(testSetOne.message).toContain('Oops');
    expect(testSetOne.level).toBe(logger.messageLevel.INFO);
  });

  it('runs the alert logger', function () {
    var AppState = can.Map.extend();
    var appState = new AppState();
    var log = logger({handlers: [logger.alertHandler(appState)]});
    log.log({message: 'Oops', title: 'Warn', level: logger.messageLevel.WARN});

    expect(appState.alert.message).toBe('Oops');
  });

});
