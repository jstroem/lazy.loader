var uiRouterHandler = require('./uiRouter');
var ngRouteHandler = require('./ngRoute');
var uiBootstrapHandler = require('./uiBootstrap');

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
    if (moduleRequires(moduleName, 'ui.bootstrap'))
      uiBootstrapHandler(moduleName);
  }

  function lazyConfig(moduleName) {
    if (!moduleExists(moduleName))
      return angular.noop;

    if (lazyModules[moduleName] !== undefined)
      return angular.noop;

    function config($controllerProvider, $provide, $compileProvider, $filterProvider, $animateProvider) {
      if (lazyModules[moduleName] !== undefined)
        return false;


      lazyModules[moduleName] = {
        controller: $controllerProvider.register,
        factory: $provide.factory,
        service: $provide.service,
        decorator: $provide.decorator,
        constant: $provide.constant,
        value: $provide.value,
        provider: $provide.provider,
        directive: $compileProvider.directive,
        component: $compileProvider.component,
        animation: $animateProvider.register,
        filter: $filterProvider.register,
      }
      return true;
    }
    config.$inject = ['$controllerProvider', '$provide', '$compileProvider','$filterProvider','$animateProvider'];
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
        decorator: mod.decorator,
        constant: mod.constant,
        value: mod.value,
        provider: mod.provider,
        directive: mod.directive,
        component: mod.component,
        animation: mod.animation,
        filter: mod.filter,
      };

      mod.controller = lazyModules[moduleName].controller;
      mod.factory = lazyModules[moduleName].factory;
      mod.service = lazyModules[moduleName].service;
      mod.decorator = lazyModules[moduleName].decorator;
      mod.constant = lazyModules[moduleName].constant;
      mod.value = lazyModules[moduleName].value;
      mod.provider = lazyModules[moduleName].provider;
      mod.directive = lazyModules[moduleName].directive;
      mod.component = lazyModules[moduleName].component;
      mod.animation = lazyModules[moduleName].animation;
      mod.filter = lazyModules[moduleName].filter;
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
