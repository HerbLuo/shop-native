/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/17
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/17 herbluo created
 */
'use strict';

const utils = require('../utils');
const settle = require('../core/settle');
const buildURL = require('../helpers/buildURL');
//noinspection ES6ModulesDependencies
const stream = weex.requireModule('stream');
const url = require('url');
const createError = require('../core/createError');
const enhanceError = require('../core/enhanceError');

import log from '../../../../log'

module.exports = function streamAdapter(config) {
    return new Promise(function dispatchStreamRequest(resolve, reject) {

        let data = config.data;
        let headers = config.headers;
        let timer;
        let aborted = false;

        // HTTP basic authentication
        let auth = undefined;
        if (config.auth) {
            let username = config.auth.username || '';
            let password = config.auth.password || '';
            auth = username + ':' + password;
        }

        // Parse url
        let parsed = url.parse(config.url);

        if (!auth && parsed.auth) {
            let urlAuth = parsed.auth.split(':');
            let urlUsername = urlAuth[0] || '';
            let urlPassword = urlAuth[1] || '';
            auth = urlUsername + ':' + urlPassword;
        }

        if (auth) {
            delete headers.Authorization;
        }

        //noinspection JSUnresolvedFunction
        let options = {
            url: buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, ''),
            method: config.method,
            headers: headers,
            type: 'text'
        };

        log.info(options.url);

        stream.fetch(options, res => {
            if (aborted) return;

            timer && clearTimeout(timer);
            timer = null;

            switch (res.headers['content-encoding']) {
                case 'gzip':
                case 'compress':
                case 'deflate':
                    throw new Error('未实现')
            }

            const response = {
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: res.headers,
                config: config,
                data: res.data,
            };

            settle(resolve, reject, response);
        });

        const req = {
            abort() {},
            end() {}
        };

        // Handle request timeout
        if (config.timeout && !timer) {
            timer = setTimeout(function handleRequestTimeout() {
                req.abort();
                reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));
                aborted = true;
            }, config.timeout);
        }

        if (config.cancelToken) {
            // Handle cancellation
            config.cancelToken.promise.then(function onCanceled(cancel) {
                if (aborted) {
                    return;
                }
                req.abort();
                reject(cancel);
                aborted = true;
            });
        }

        // Send the request
        if (utils.isStream(data)) {
            data.pipe(req);
        } else {
            req.end(data);
        }
    });
};

