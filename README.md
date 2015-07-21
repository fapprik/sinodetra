# Sinodetra

> Minimal Sinatra like router for node.js

## Installation

	npm install sinodetra

## Usage

At first, (install and) require Sinodetra within your script and specify your preferred port (`8000` in this example).

	var app = require('sinodetra')(8000);

That’s it, you’re able to add routes now. Sinodetra extends node’s HTTP server by providing `get`, `post`, `put`, and `delete` methods. You can add routes like this.

	app.get('/', function(request, response) {
		response.plain('Hello world!');
	});

	app.get('/user/:user', function(request, response, user) {
		response.html('Hello, <strong>' + user + '</strong>');
	});

	app.get('/show/([0-9]+)', function(request, response, id) {
		response.html('Hello, <strong>#' + id + '</strong>');
	});

As you can see, you can also use regular expressions within your route definitions. For a better readability, Sinodetra provides the opportunity to use placeholders (see `:user` above). However, these placeholders are nothing but a regular expression in the end.

In addition, Sinodetra extends node’s HTTP `ServerResponse` by providing `html`, `plain`, and `json` methods. These methods are actually shortcuts for the likewise provided `send` method, which allows you to customize the HTTP content type and status code for your response.

	response.send('Hello World', 'text/html', 200);

Using `response.send()` you can set the HTTP content type and status code to whatever you need.

And—last but not least—there’s a way to define a callback if no routes match the requested path. This is normally used to display some fancy 404 error.

	app.error(function(request, response) {
		response.plain('404 Not Found');
	});

## Parameters

When you’re building applications using Sinodetra, you’ll need to get information from your users. Kindly, grabbing data from the request is an easy enough process. You can access all parameters by using the `request.params` object.

	app.get('/test', function(request, response) {
		response.plain('ID = ' + request.params.id);
	});

Alternatively, you can use the provided `request.param` method, which returns the parameter in case it was provided or `false` otherwise.

	app.get('/test', function(request, response) {
		response.plain('ID = ' + request.param('id'));
	});

Sinodetra will try to detect what kind of data was sent within a request. If it’s JSON, `request.body` will be the parsed JSON object. Otherwise, Sinodetra assumes that the information was passed as `application/x-www-form-urlencoded` and parse the query string.

Assuming you execute a `POST` request containing `demo=Lorem&id=Ipsum` to `/test?id=123`, Sinodetra will merge those parameters, using `GET` parameters as the base and overwriting existing keys with the data from the original methods. Thus, the previous example would result the following `request.params` object.

```json
{
    "demo": "Lorem",
    "id": "Ipsum"
}
```

Please note that Sinodetra has no nice way to handle file uploads (yet!).

## Examples

	app.get('/', function(request, response) {
		response.plain('Hello world!');
	});

	app.get('/say/:greeting/to/:person', function(request, response, greeting, person) {
		response.html('<b>' + greeting + '</b>, ' + person + '!');
	});

	app.get('/([0-9]+)/plus/([0-9]+)', function(request, response, one, two) {
		response.plain((parseInt(one, 10) + parseInt(two, 10)).toString());
	});

	app.error(function(request, response) {
		response.plain('404');
	});

## Changelog

* 0.0.3
	* Add parameter support
* 0.0.2
	* Fix error callback
* 0.0.1
	* Initial version

## TODO

- Documentation
- Tests

## License

Copyright (c) 2015 [fapprik](http://fapprik.com/)  
Licensed under the MIT license.

See LICENSE for more info.