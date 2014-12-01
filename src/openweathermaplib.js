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
 *
 * Please configure the library to use your own APIkey:
 * WeatherLib.config({APIkey: 'your_key'});
 */

/**
 * @file A JS library that makes async requests to the openweathermap.org API.
 * @author Marios Isaakidis <a href="mailto:misaakidis@yahoo.gr">misaakidis@yahoo.gr</a>
 * @license Copyright 2014 Marios Isaakidis and other contributors
 * Released under the <a href="http://opensource.org/licenses/MIT">MIT license</a>
 */

/**
 * @module WeatherLib
 */

/**
 * The module this library exports.
 * @lends module:WeatherLib
 */
var WeatherLib = (function () {
  'use strict';

  /**
   * Configuration object
   * @private
   * @memberOf module:WeatherLib
   * @default
   * @property {string} APIkey - The APIkey to be used in requests
   * @property {string} measSystem - Measurement system (can be internal, metric or imperial)
   * @property {number} reqTimeout - Milliseconds after the request times out
   * @property {langSupported} lang - Set the language (supported languages {@link module:WeatherLib#langSupported_})
   */
  var conf_ = {
    APIkey: '52977103b38b2cf43df8ecfb577874c4',
    measSystem: 'metric',
    reqTimeout: 15000,
    lang: 'en'
  };

  /**
   *
   *
   * @function config
   * @memberOf module:WeatherLib
   * @example
   * // Sets the measurement system to imperial
   * WeatherLib.config({measSystem: 'imperial'});
   */
  var config = function (newConf) {
    if (typeof newConf.APIkey == 'string') {
      conf_.APIkey = newConf.APIkey;
    }
    if (typeof newConf.measSystem == 'string') {
      conf_.measSystem = newConf.measSystem;
    }
    if (typeof newConf.reqTimeout == 'number') {
      conf_.reqTimeout = newConf.reqTimeout;
    }
    if (typeof newConf.lang == 'string') {
      conf_.lang = newConf.lang;
    }
  };

  /**
   * Callback function to be executed upon successful request
   * @callback callback
   * @memberOf module:WeatherLib
   * @param {json} responseJSON - JSON document that came as responseText
   * @param {object} callbackOptions - The object to be passed to the callback function
   */

  /**
   * Callback function to be executed when a request fails or times out
   * @callback onError
   * @memberOf module:WeatherLib
   * @param {number} errorStatus - The error status of the XMLHttpRequest
   * @param {object} onErrorOptions - The object to be passed to the onError function
   */

  /**
   * Private function that makes the GET request to openweathermap.org servers
   *
   * @function reqAPI_
   * @memberOf module:WeatherLib
   * @private
   * @param {string} apiPath - The API resource to request
   * @param {json} urlOptions - Any options to be included in the query (e.g. city or coordinates)
   * @param {module:WeatherLib.callback} [callback] - The function to be executed after a successful request
   * @param {object} [callbackOptions] - The object to be passed to callback function
   * @param {module:WeatherLib.onError} [onError] - The callback function to be executed when a request fails/times out
   * @param {object} [onErrorOptions] - The object to be passed to onError function
   * @param {boolean} [async=true] - Sets the request to be asynchronous (default true)
   */
  var reqAPI_ = function (apiPath, urlOptions, callback, callbackOptions, onError, onErrorOptions, async) {
    var urlQueryString = 'http://api.openweathermap.org/data/2.5/' + apiPath + '?';
    for (var key in urlOptions) {
      urlQueryString += key + '=' + urlOptions[key] + '&';
    }
    urlQueryString += 'units=' + conf_.measSystem;
    urlQueryString += '&lang=' + conf_.lang;
    urlQueryString += '&APPID=' + conf_.APIkey;

    var request = new XMLHttpRequest();

    var callbackFunction = callback || function () {};
    var onErrorFunction = onError || function () {};
    var asyncReq;
    if (async === undefined || async) {
      asyncReq = true;
      request.timeout = conf_.reqTimeout;
    } else {
      asyncReq = false;
    }

    request.onerror = onErrorFunction;
    request.onload = function (data) {
      if (this.status == 200) {
        var responseJSON = JSON.parse(request.responseText);
        if (responseJSON.cod == 200) {
          callbackFunction(responseJSON, callbackOptions);
          return;
        }
      }

      onErrorFunction(this.status, onErrorOptions);
    };

    request.open('GET', urlQueryString, asyncReq);
    request.send();
  };

  /**
   * @function getCurrentCoord
   * @memberOf module:WeatherLib
   */
  var getCurrentCoord = function (lat, lon, callback, callbackOptions, onError, onErrorOptions, async) {
    reqAPI_('weather', {
      lat: lat,
      lon: lon
    }, callback, callbackOptions, onError, onErrorOptions, async);
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   */
  var getCurrentCity = function (city, callback, callbackOptions, onError, onErrorOptions, async) {
    reqAPI_('weather', {
      q: city
    }, callback, callbackOptions, onError, onErrorOptions, async);
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   */
  var getForecastCoord = function (lat, lon, callback, callbackOptions, onError, onErrorOptions, async) {
    reqAPI_('forecast', {
      lat: lat,
      lon: lon
    }, callback, callbackOptions, onError, onErrorOptions, async);
  };

  /**
   * @function
   * @private
   * @memberOf module:WeatherLib
   * @param {json} Parsed XMLHttpRequest's responseText
   * @returns {json} The
   */
  var parseResponse_ = function (responseJSON) {
    var weatherJSON;
    if (responseJSON.list === undefined) {
      weatherJSON = {
        location: responseJSON.name,
        country: responseJSON.sys.country,
        wind: {
          deg: responseJSON.wind.deg,
          speed: responseJSON.wind.speed
        },
        humidity: responseJSON.main.humidity,
        pressure: responseJSON.main.pressure,
        temp: responseJSON.main.temp,
        temp_max: responseJSON.main.temp_max,
        temp_min: responseJSON.main.temp_min,
        weather_code: responseJSON.weather[0].id,
        short_desc: responseJSON.weather[0].main,
        long_desc: responseJSON.weather[0].description
      };
    } else {
      weatherJSON = {
        location: responseJSON.city.name,
        country: responseJSON.city.country,
      };

      var forecasts = [];
      for (var forecast in responseJSON.list) {
        forecasts.push({
          dt: responseJSON.list[forecast].dt,
          temp: responseJSON.list[forecast].main.temp
        });
      }
      weatherJSON.forecasts = forecasts;
    }
    return weatherJSON;
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   * @returns {json}
   */
  var getCurrentCoordJSON = function (lat, lon) {
    var result;
    getCurrentCoord(lat, lon, function (responseJSON) {
      result = parseResponse_(responseJSON);
    }, null, null, null, false);
    return result;
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   * @returns {json}
   */
  var getCurrentCityJSON = function (city) {
    var result;
    getCurrentCity(city, function (responseJSON) {
      result = parseResponse_(responseJSON);
    }, null, null, null, false);
    return result;
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   * @returns {json}
   */
  var getForecastCoordJSON = function (lat, lon) {
    var result;
    getForecastCoord(lat, lon, function (responseJSON) {
      result = parseResponse_(responseJSON);
    }, null, null, null, false);
    return result;
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   */
  var getCustom = function (urlOptions, callback, callbackOptions, onError, onErrorOptions) {
    reqAPI_(urlOptions, callback, callbackOptions, onError, onErrorOptions);
  };

  /*
   * Reveal private functions by assigning public pointers,
   * following Christian Heilmann's module pattern
   */
  return {
    config: config,
    getCurrentCoord: getCurrentCoord,
    getCurrentCity: getCurrentCity,
    getCustom: getCustom,
    getCurrentCoordJSON: getCurrentCoordJSON,
    getCurrentCityJSON: getCurrentCityJSON,
    getForecastCoordJSON: getForecastCoordJSON
  };

})();
