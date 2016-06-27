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
