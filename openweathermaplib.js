var owmLib = (function () {
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

	var reqAPI = function (urlOptions) {
		var urlQueryString = 'http://api.openweathermap.org/data/2.5/weather?';
		for (var key in urlOptions) {
			urlQueryString += key + '=' + urlOptions[key] + '&';
		}

		var request = new XMLHttpRequest();
		request.onload = function(data) {
			alert(request.responseText);
		}

		request.open('GET', urlQueryString, true);
		request.send();
	};

	var reqCurrentCoord = function (lat, lon) {
		reqAPI({
			lat: lat,
			lon: lon
		})
	}

	var reqCustom = function (urlOptions) {
		reqAPI(urlOptions);
	}

	return {
		config: config,
		reqCurrentCoord: reqCurrentCoord,
		reqCustom: reqCustom
	};

})();