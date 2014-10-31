var WeatherLib = (function () {
	'use strict';

	var conf = {
		APIkey: '52977103b38b2cf43df8ecfb577874c4',
		measSystem: 'metric',
		reqTimeout: 15000
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
	}

	var reqAPI = function (apiPath, urlOptions, callback, onError) {
		var urlQueryString = 'http://api.openweathermap.org/data/2.5/' + apiPath + '?';
		for (var key in urlOptions) {
			urlQueryString += key + '=' + urlOptions[key] + '&';
		}
		urlQueryString += 'units=' + conf.measSystem;
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
		});
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