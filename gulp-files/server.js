/**
 * Created by Pratik on 2/25/2016.
 */
'use strict';

var express     = require('express');
var serveStatic = require('serve-static');
var Yelp        = require('yelp');
var yelpParse   = require('./yelp-response-parse');
var fourSquare  = require('./four-square-api');
/*Merge function to combine data from both the servers*/
var merge      = require('./merge-results');
var fourParse  = require('./four-square-response-parse');
var bodyParser = require('body-parser');
var favicon    = require('serve-favicon');

var app = express();
app.use(serveStatic(__dirname + '/../build'));
app.use(favicon(__dirname + '/../build/favicon.ico'));
app.use(bodyParser.json());

/*Yelp middleware*/
var yelp = new Yelp({
	consumer_key   : 'hyIQVkkGLREDsZobyPp5dQ',
	consumer_secret: 'UgKdpO46BHlEOT-3K3MIPilF-Ro',
	token          : 'PCPmAjNSEpcZ4T7TFaQ3VKj8-nhhRhWJ',
	token_secret   : 'uF-cSlKj9usvzCIjSeVzwR2OcS8'
});

function getFourSquare(term, location, isCoordinates, callBack) {
	var input   = {};
	input.query = term;
	input.limit = 15;

	if (isCoordinates) {
		input.ll = location;
	} else {
		input.near = location;
	}

	fourSquare(input, function (err, venues) {
		if (err) {
			return callBack(err);
		}
		return callBack(null, fourParse(venues));
	});
}

function getYelpData(term, location, isCoordinates, callBack) {
	var input   = {};
	input.term  = term;
	input.limit = 15;

	if (isCoordinates) {
		input.ll = location;
	} else {
		input.location = location;
	}

	yelp.search(input)
		.then(function (data) {
			return callBack(null, yelpParse(data));
		}).catch(function (cause) {
		return callBack(cause);
	});
}


function getData(term, location, isCoordinates, callBack) {
	var gotError  = false;
	var firstData = null;

	getYelpData(term, location, isCoordinates, function (err, data) {
		if (err) {
			if (gotError) {
				return callBack(err);
			} else {
				gotError  = true;
				firstData = [];
			}
		} else {
			if (firstData) {
				return callBack(null, merge(data, firstData));
			} else {
				if (gotError) {
					return callBack(null, merge(data, []));
				}
				firstData = data;
			}
		}
	});

	getFourSquare(term, location, isCoordinates, function (err, data) {
		if (err) {
			if (gotError) {
				return callBack(err);
			} else {
				gotError  = true;
				firstData = [];
			}
		} else {
			if (firstData) {
				return callBack(null, merge(firstData, data));
			} else {
				if (gotError) {
					return callBack(null, merge([], data));
				}
				firstData = data;
			}
		}
	});
}

app.post('/getdata', function (req, res) {
	var query         = req.body.query,
	    location      = req.body.location,
	    isCoordinates = req.body.isCoordinates;
	if (query && location) {
		return getData(query, location, isCoordinates, function (err, data) {
			if (err) {
				return res.send(JSON.stringify({err: true, code: err}));
			}
			return res.send(JSON.stringify(data));
		});
	} else {
		return res.send(JSON.stringify({err: true, code: 'INVALID_REQUEST'}));
	}
});

module.exports = app;