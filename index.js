#!/usr/bin/env node

/*
* Sinodetra
* https://github.com/fapprik/sinodetra
*
* Copyright (c) 2015 fapprik <hello@fapprik.com>
* Licensed under the MIT license.
* https://github.com/fapprik/sinodetra/blob/master/LICENSE
*/

'use strict';

module.exports = function(port) {

    var routes = { };
    var error;
    var http = require('http');
    var url = require('url');
    var queryString = require('querystring');
    var server = http.createServer();
    var parse = url.parse;
    var placeholders = /(:\w+)/gi;

    ['GET', 'POST', 'PUT', 'DELETE'].forEach(function(method) {
        http.Server.prototype[method.toLowerCase()] = function(path, callback) {
            if (typeof routes[method] !== 'object') {
                routes[method] = {};
            }
            if (placeholders.test(path)) {
                path = path.replace(placeholders, function() {
                    return '([^\/]+)';
                });
            }
            routes[method][path] = callback;
        }
    });

    http.Server.prototype['error'] = function(callback) {
        error = callback;
    };

    http.ServerResponse.prototype.send = function(message, type, code) {
        code = code || 200;
        type = type || 'text/html';
        if (typeof message === 'object') {
            message = JSON.stringify(message);
            type = 'application/json';
        }
        this.writeHead(code, {
            'Content-Type': type
        });
        this.end(message);
    };

    http.ServerResponse.prototype.html = function(message, code) {
        this.send(message, 'text/html', code);
    };

    http.ServerResponse.prototype.plain = function(message, code) {
        this.send(message, 'text/plain', code);
    };

    http.ServerResponse.prototype.json = function(message, code) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        this.send(message, 'application/json', code);
    };
    
    server.on('request', function(request, response) {
        var pathname = parse(request.url).pathname;
        if (typeof routes[request.method] === 'object') {
            for (var route in routes[request.method]) {
                var matches = pathname.match('^' + route + '$');
                if (matches) {
                    var args = [request, response];
                    matches.shift();
                    matches.forEach(function(match) {
                        args.push(match);
                    });
                    var handle = routes[request.method][route];
                    request.body = '';
                    request.on('data', function(data) {
                        request.body += data;
                    });
                    request.params = url.parse(request.url, true).query || {};
                    request.param = function(key) {
                        return key in request.params ? request.params[key] : false;
                    };
                    request.on('end', function() {
                        try {
                            request.body = JSON.parse(request.body);
                        } catch (e) {
                            var query = queryString.parse(request.body) || {};
                            for (var attr in query) {
                                request.params[attr] = query[attr];
                            }
                        }
                        handle.apply(this, args);
                    });
                    return;
                }
            }
        }
        if (typeof error === 'function') {
            error.apply(this, arguments);
        }
    });

    return server.listen(port);

};
