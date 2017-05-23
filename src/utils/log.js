/*!
 * Log.js
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 *
 * changed by HerbLuo
 */
const fmt = require('util').format;
//noinspection ES6ModulesDependencies
const logModule = weex.requireModule('WXShpLifecycle');
const modal = weex.requireModule('modal');

const ConsoleWriteable = function () {
};
ConsoleWriteable.prototype.write = (str) => {
    if (logModule && logModule.log) {
        logModule.log(str || typeof str);
    } else {
        console.info(str);
    }

};


/**
 * Initialize a `Logger` with the given log `level` defaulting
 * to __DEBUG__ and `stream` defaulting to _stdout_.
 *
 * @param level
 * @param writable
 * @api public
 */
const Log  = function Log(level, writable) {
    if ('string' === typeof level) level = Log[level.toUpperCase()];
    this.level = level || Log.DEBUG;
    this.writable = writable || new ConsoleWriteable();
};

/**
 * System is unusable.
 *
 * @type Number
 */

Log.EMERGENCY = 0;

/**
 * Action must be taken immediately.
 *
 * @type Number
 */

Log.ALERT = 1;

/**
 * Critical condition.
 *
 * @type Number
 */

Log.CRITICAL = 2;

/**
 * Error condition.
 *
 * @type Number
 */

Log.ERROR = 3;

/**
 * Warning condition.
 *
 * @type Number
 */

Log.WARNING = 4;

/**
 * Normal but significant condition.
 *
 * @type Number
 */

Log.NOTICE = 5;

/**
 * Purely informational message.
 *
 * @type Number
 */

Log.INFO = 6;

/**
 * Application debug messages.
 *
 * @type Number
 */

Log.DEBUG = 7;

/**
 * prototype.
 */

Log.prototype = {
    /**
     * Log output message.
     *
     * @param  {String} levelStr
     * @param  {Array} args
     * @api private
     */

    log: function (levelStr, args) {
        if (Log[levelStr] <= this.level) {
            const msg = fmt.apply(null, args);
            this.writable.write(
                '[' + new Date().getTime() + ']'
                + ' ' + levelStr
                + ' ' + msg
                + '\n'
            );
        }
    },

    /**
     * Log emergency `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    emergency: function (msg) {
        this.log('EMERGENCY', arguments);
    },

    /**
     * Log alert `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    alert: function (msg) {
        this.log('ALERT', arguments);
    },

    /**
     * Log critical `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    critical: function (msg) {
        this.log('CRITICAL', arguments);
    },

    /**
     * Log error `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    error: function (msg) {
        const duration = msg.length / 18;
        modal.toast({
            message: msg,
            duration: duration < 1 ? 1 : duration,
        });
        this.log('ERROR', arguments);
    },

    /**
     * Log warning `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    warning: function (msg) {
        this.log('WARNING', arguments);
    },

    /**
     * Log notice `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    notice: function (msg) {
        this.log('NOTICE', arguments);
    },

    /**
     * Log info `msg`.
     *
     * @param  {String} msg
     * @api public
     */

    info: function (msg) {
        this.log('INFO', arguments);
    },

    /**
     * Log debug `msg`.
     *
     * @param  msg
     * @api public
     */

    debug: function (msg) {
        this.log('DEBUG', arguments);
    }
};
export default new Log('info');
