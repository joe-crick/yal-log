# yal-log [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Yet Another Logger

##Overview

Yal is a logger that gives you a lot of control over how logging happens. Basically, yal is a structure  you can plug logging tasks into, and it will run those tasks in the order it receives them.

Getting yal up and running is fairly trivial. After including yal in your application, you initialize it. Yal will return an object with a log method, and several convenience methods ([see below for details](#API)). Yal, itself, also has a few useful properties.

```js
var yal = require('yal-log');

// Initialize yal
var log = yal({handlers: [handlerOne, handlerTwo]});
	// Yal returns a log object instance. Call the log method to run the logger.
    log.log({message: 'Oops', title: 'Warn', level: logger.messageLevel.WARN});
```

Yal also has a few convenience methods, which essentially append a messageLevel to your log message:

 - .error
 - .warn
 - .info

By necessity, the convenience methods impose some constraints on the type of log message you can pass to yal: You have to pass an object of some kind.

## Internals

Yal manages logging internally in two steps:

1. Run a log input through the `logging provider`.
2. Pass the output of the `logging provider` to one or more `log handlers`.

A `logging provider` takes an input and produces a log entry. A `log handler` receives the output of a `logging provider` and does something with it. That something can be whatever you want it to be. Some common options are:

 - Writing the content to a server or database log using an API
 - Presenting a modal to the end user
 - Sending an alert

Yal provides a default `logging provider`, but you can write your own. Yal has one default `log handler`, the `consoleHandler`, which writes log entries to the browser console. Yal also provides a few built-in convenience features:

 - attach to global, and
 - attach to console

**attach to global**:
You can attach yal to the global window.onerror event, and it will capture all uncaught errors and run them through the logProvider. It does this without overwriting any existing functions assigned to window.onerror.

**attach to console**:
You can tell yal to hijack the default console.xxx methods in the browser:

 - console.error
 - console.warn
 - console.info

If you choose this option, anything you send to a console method will run through the logger. This option preservs the integrity of the console methods.

## Installation

```sh
$ npm install --save yal-log
```


## Usage

####Basic Usage

```js
var yal = require('yal-log');

  // Sample log handler
  var handlerOne = function(logData, error){
    testSetOne.message = logData.message + '; setOne';
    testSetOne.error = error ? error.stack : '';
    testSetOne.level = logData.level;
  };
 
  // Another sample log handler
  var handlerTwo = function(logData){
    testSetTwo.message = logData.message + '; setTwo';
    testSetTwo.level = logData.level;
  };

// Initialize yal with the log handlers
var log = yal({handlers: [handlerOne, handlerTwo]});
	// Yal returns a log object instance. Call the log method to run the logger.
    log.log({message: 'Oops', title: 'Warn', level: logger.messageLevel.WARN});
```

####Using yal with a Custom Log Provider

Yal's default `log provider` creates a log entry in the following format:

> date: 2015-09-23T20:10:12+00:00 | level: WARN | host: site.com | message: Oops | stack_trace: {*trace if there is one*}

The default `log provider` is able to generate a stack trace if you provide the log entry with an instance of Error. To get an accurate stack trace, you must create the Error instance in the function where you are logging the issue. Below is an example:

```js
// yal has already been initialized, as
// var log = yal({handlers: [myHandler]});
function logMyError(){
   // Try to connect to my API
   myModel.save().then(function(){
     // My Update Worked. Yay!!!
   }).fail(function(err){
	 // Something went wrong, let's log this. We want a stack trace, so create
	 // a new error object, and pass it into yal.
	 log.log(err.json, new Error());
   });
}
```

If you want a different log format, you can write your own log provider. A ridiculously simple example of that is below:

```js
  var mockLogProvider = function(logData, error){
    // Overwrites every log message with 'Mock Provider'
    logData.message = 'Mock Provider';
    return logData;
  };

  var log = logger({handlers: [setTwo], loggingProvider: mockLogProvider});
```

####Using yal with the isGlobal and isConsole Options

```js
 var log = logger({handlers: [setTwo], isGlobal: true, isConsole: true});
```

##API <a name="API"></a>

####Yal Methods and Properties

| Name        | Type           | Description  |
| ------------- |:-------------:| -----|
| yal      | function | Initializes yal, and returns a yal instance |
| messageLevel      | enum      |  Contains the three message level types: ERROR, WARN, and INFO  |
| defaultLogProvider | function (log provider)      |    The defaultLogProvider |
| consoleHandler | function (log handler)      |  The consoleHandler  |


####Yal Initialization Options

When you initialize yal, you provide it with a configuration object. Valid properties of that configuration object are as follows:

| Name        | Type           | Description  |
| ------------- |:-------------:| -----|
| handlers      | array | An array of log handler functions |
| isGlobal      | boolean      |  Whether yal should attach to window.onerror  |
| isConsole | boolean      |    Whether yal should attach to the console methods |
| logProvider | function      |  Override the default log provider  |

## License

MIT © [Joe Crick](http://www.josephcrick.com)


[npm-image]: https://badge.fury.io/js/yal-log.svg
[npm-url]: https://npmjs.org/package/yal-log
[travis-image]: https://travis-ci.org/joe-crick/yal-log.svg?branch=master
[travis-url]: https://travis-ci.org/joe-crick/yal-log
[daviddm-image]: https://david-dm.org/joe-crick/yal-log.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/joe-crick/yal-log
