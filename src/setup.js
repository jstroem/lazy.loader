var uiRouterHandler = require('./uiRouter');
var ngRouteHandler = require('./ngRoute');

module.exports = (function() {
  var lazyModules = {};
  var originalMethods = {};

  function moduleExists(moduleName) {
    try {
      angular.module(moduleName);
      return true;
    } catch(e) {
      return false;
    }
  }

  function moduleRequires(moduleName, requiredModuleName) {
    var module = angular.module(moduleName);
    return module.requires.indexOf(requiredModuleName) != -1;
  }

  function bindModuleDependencies(moduleName) {
    if (moduleRequires(moduleName, 'ui.router'))
      uiRouterHandler(moduleName);
    if (moduleRequires(moduleName, 'ngRoute'))
      ngRouteHandler(moduleName);
  }

  function lazyConfig(moduleName) {
    if (!moduleExists(moduleName))
      return angular.noop;

    if (lazyModules[moduleName] !== undefined)
      return angular.noop;

    function config($controllerProvider, $provide, $compileProvider) {
      if (lazyModules[moduleName] !== undefined)
        return false;


      lazyModules[moduleName] = {
        controller: $controllerProvider.register,
        factory: $provide.factory,
        service: $provide.service,
        directive: $compileProvider.directive
      }
      return true;
    }
    config.$inject = ['$controllerProvider', '$provide', '$compileProvider'];
    return config;
  }

  function lazyRun(moduleName) {
    if (!moduleExists(moduleName))
      return angular.noop;

    return function run() {
      if (lazyModules[moduleName] === undefined || originalMethods[moduleName] !== undefined)
        return false;

      var mod = angular.module(moduleName);

      originalMethods[moduleName] = {
        controller: mod.controller,
        factory: mod.factory,
        service: mod.service,
        directive: mod.directive
      };

      mod.controller = lazyModules[moduleName].controller;
      mod.factory = lazyModules[moduleName].factory;
      mod.service = lazyModules[moduleName].service;
      mod.directive = lazyModules[moduleName].directive;
      return true;
    }
  }

  function reset() {
    lazyModules = {};
    originalMethods = {};
  }

  function lazyModule(moduleName) {
    return lazyModules[moduleName];
  }

  function lazyInit(moduleName) {
    if (!moduleExists(moduleName))
      return;

    bindModuleDependencies(moduleName);

    return targetModule = angular.module(moduleName)
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
