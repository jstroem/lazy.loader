(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var setup = require('./setup');

var mod = angular.module('lazy.loader', []).config(setup.reset);
mod.lazy = setup;

module.exports = mod.name;

},{"./setup":2}],2:[function(require,module,exports){
module.exports = (function() {
  var lazyModules = {};
  var originalMethods = {};

  function lazyConfig(name) {
    if (lazyModules[name] !== undefined)
      return angular.noop;

    function config($controllerProvider, $provide, $compileProvider) {
      lazyModules[name] = {
        controller: $controllerProvider.register,
        factory: $provide.factory,
        service: $provide.service,
        directive: $compileProvider.directive
      }
    }
    config.$inject = ['$controllerProvider', '$provide', '$compileProvider'];
    return config;
  }

  function lazyRun(name) {
    return function run() {
      if (lazyModules[name] === undefined || originalMethods[name] !== undefined)
        return false;

      var mod = angular.module(name);

      originalMethods[name] = {
        controller: mod.controller,
        factory: mod.factory,
        service: mod.service,
        directive: mod.directive
      };

      mod.controller = lazyModules[name].controller;
      mod.factory = lazyModules[name].factory;
      mod.service = lazyModules[name].service;
      mod.directive = lazyModules[name].directive;
      return true;
    }
  }

  function reset() {
    lazyModules = {};
    originalMethods = {};
  }

  function lazyModule(name) {
    return lazyModules[name];
  }

  function lazyInit(moduleName) {
    var targetModule = angular.module(moduleName)
      .config(lazyConfig(moduleName))
      .run(lazyRun(moduleName));
  }

  return {
   config: lazyConfig,
   run: lazyRun,
   reset: reset,
   module: lazyModule,
   init: lazyInit
 }
}());

},{}]},{},[1])