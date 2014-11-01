/*
 * OpenWeatherMap-Lib JavaScript Library
 * https://github.com/GeeksHubs/openweathermap-lib
 *
 * Copyright 2014 Marios Isaakidis and other contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Not affiliated with openweathermap.org,
 * distributed without any warranty.
 */

/**
 * @file A JS library that makes async requests to openweathermap.org API
 * @author <a href="mailto:misaakidis@yahoo.gr">Marios Isaakidis</a>
 */

var WeatherLib = (function () {
	'use strict';

	var conf = {
		APIkey: '52977103b38b2cf43df8ecfb577874c4',
		measSystem: 'metric',
		reqTimeout: 15000,
		lang: 'en'
	};

	var config = function (newConf) {
		if (newConf.APIkey !== undefined) {
			conf.APIkey = newConf.APIkey;
		}
		if (newConf.measSystem !== undefined) {
			conf.measSystem = newConf.measSystem;
		}
		if (newConf.reqTimeout !== undefined) {
			conf.reqTimeout = newConf.reqTimeout;
		}
		if (newConf.lang !== undefined) {
			conf.lang = newConf.lang;
		}
	}

	/**
	 * Private function that makes the GET request to openweathermap.org servers
	 * 
	 * @function WeatherLib#reqApi
	 * @private
	 * @param {String} apiPath The API resource to request
	 * @param {JSON} urlOptions Any options to be included in the query (e.g. city or coordinates)
	 * @param {Function} [callback] The function to be executed after a successful request
	 * @param {Function} [onError] The callback function to be executed when a request fails/timeouts
	 */
	var reqAPI = function (apiPath, urlOptions, callback, onError) {
		var urlQueryString = 'http://api.openweathermap.org/data/2.5/' + apiPath + '?';
		for (var key in urlOptions) {
			urlQueryString += key + '=' + urlOptions[key] + '&';
		}
		urlQueryString += 'units=' + conf.measSystem;
		urlQueryString += '&lang=' + conf.lang;
		urlQueryString += '&APPID=' + conf.APIkey;

		var callbackFunction = callback || function(){};
		var onErrorFunction = onError || function(){};

		var request = new XMLHttpRequest();
		request.timeout = conf.reqTimeout;

		request.onerror = onErrorFunction;
		request.onload = function(data) {
			if (this.status == 200) {
				var responseJSON = JSON.parse(request.responseText);
				if (responseJSON.cod == 200) {
					callbackFunction();
					return;
				}
			}
			
			onErrorFunction();
		}

		request.open('GET', urlQueryString, true);
		request.send();
	};

	var reqCurrentCoord = function (lat, lon, callback, onError) {
		reqAPI('weather', {
			lat: lat,
			lon: lon
		}, callback, onError);
	}

	var reqCurrentCity = function (city, callback, onError) {
		reqAPI('weather', {
			q: city
		}, callback, onError);
	}

	var reqCustom = function (urlOptions, callback, onError) {
		reqAPI(urlOptions, callback, onError);
	}

	return {
		config: config,
		reqCurrentCoord: reqCurrentCoord,
		reqCurrentCity: reqCurrentCity,
		reqCustom: reqCustom
	};

})();