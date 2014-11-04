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
 * @file A JS library that makes async requests to openweathermap.org API.
 * @author Marios Isaakidis <a href="mailto:misaakidis@yahoo.gr">misaakidis@yahoo.gr</a>
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
   * @type {json}
   */
  var conf = {
    APIkey: '52977103b38b2cf43df8ecfb577874c4',
    measSystem: 'metric',
    reqTimeout: 15000,
    lang: 'en'
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   */
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
  };

  /**
   * Private function that makes the GET request to openweathermap.org servers
   *
   * @function
   * @memberOf module:WeatherLib
   * @private
   * @param {string} apiPath The API resource to request
   * @param {json} urlOptions Any options to be included in the query (e.g. city or coordinates)
   * @param {Function} [callback] The function to be executed after a successful request
   * @param {object} [callbackOptions] The object to be passed to callback function
   * @param {function} [onError] The callback function to be executed when a request fails/timeouts
   * @param {object} [onErrorOptions] The object to be passed to onError function
   */
  var reqAPI = function (apiPath, urlOptions, callback, callbackOptions, onError, onErrorOptions) {
    var urlQueryString = 'http://api.openweathermap.org/data/2.5/' + apiPath + '?';
    for (var key in urlOptions) {
      urlQueryString += key + '=' + urlOptions[key] + '&';
    }
    urlQueryString += 'units=' + conf.measSystem;
    urlQueryString += '&lang=' + conf.lang;
    urlQueryString += '&APPID=' + conf.APIkey;

    var callbackFunction = callback || function () {};
    var onErrorFunction = onError || function () {};

    var request = new XMLHttpRequest();
    request.timeout = conf.reqTimeout;

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

    request.open('GET', urlQueryString, true);
    request.send();
  };

  /**
   * @function
   * @memberOf module:WeatherLib
   */
  var reqCurrentCoord = function (lat, lon, callback, callbackOptions, onError, onErrorOptions) {
    reqAPI('weather', {
      lat: lat,
      lon: lon
    }, callback, callbackOptions, onError, onErrorOptions);
  };

  /** @function
   * @memberOf module:WeatherLib
   */
  var reqCurrentCity = function (city, callback, callbackOptions, onError, onErrorOptions) {
    reqAPI('weather', {
      q: city
    }, callback, callbackOptions, onError, onErrorOptions);
  };

  /** @function
   * @memberOf module:WeatherLib
   */
  var reqCustom = function (urlOptions, callback, callbackOptions, onError, onErrorOptions) {
    reqAPI(urlOptions, callback, callbackOptions, onError, onErrorOptions);
  };

  return {
    config: config,
    reqCurrentCoord: reqCurrentCoord,
    reqCurrentCity: reqCurrentCity,
    reqCustom: reqCustom
  };

})();
