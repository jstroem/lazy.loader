(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var setup = require('./setup');
var loaderService = require('./service');

var mod = angular.module('lazy.loader', [])
  .service('lazyLoaderService', loaderService);
mod.lazy = setup;

module.exports = mod.name;

},{"./service":3,"./setup":4}],2:[function(require,module,exports){
module.exports = function (moduleName) {
  function run($route) {
    var routeName, route;
    for(routeName in $route.routes) {
      route = $route.routes[routeName];
      if (route.hasOwnProperty('controllerUrl')) {
        if (route.resolve === undefined)
          route.resolve = {};
        route.resolve['$$lazyLoader$controller'] = resolver(route.controllerUrl);
      }
    }
  }
  run.$inject = ['$route'];

  function resolver(fileUrl) {
    function resolveFile(lazyLoaderService) {
      return lazyLoaderService.load(fileUrl);
    }
    resolveFile.$inject = ['lazyLoaderService'];
    return resolveFile;
  }

  angular.module(moduleName).run(run);
}

},{}],3:[function(require,module,exports){
/**
 * Loader service inspired by https://github.com/urish/angular-load
 */
function service($q, $document, $timeout) {
  var document = $document[0];
  var service = {};
  var cache = {};

  function onLoadHandler(element, deferred) {
    return function(e) {
      if (element.readyState && element.readyState !== 'complete' && element.readyState !== 'loaded')
				return;

      $timeout(function() {
        deferred.resolve(element);
      });
    }
  }

  function onErrorHandler(element, deferred) {
    return function (e) {
        $timeout(function() {
            deferred.reject(new Error("Couldn't load the file"));
        });
    }
  }

  service.load = function load(src) {
    if (cache[src] !== undefined)
      return cache[src];

    var deferred = $q.defer();

    var script = document.createElement('script');
		script.src = src;
		document.body.appendChild(script);

    script.onload = script.onreadystatechange = onLoadHandler(script, deferred);
    script.onerror = onErrorHandler(script, deferred);
    return cache[src] = deferred.promise;
  };

  return service;
}
service.$inject = ['$q','$document','$timeout'];

module.exports = service;

},{}],4:[function(require,module,exports){
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

},{"./ngRoute":2,"./uiBootstrap":5,"./uiRouter":6}],5:[function(require,module,exports){
module.exports = function (moduleName) {
  function decorate($delegate) {
    var originalOpen = $delegate.open;

    $delegate.open = function(modalOptions) {
      if (modalOptions.hasOwnProperty('controllerUrl')) {
        if (modalOptions.resolve === undefined)
            modalOptions.resolve = {};
        modalOptions.resolve['$$lazyLoader$controller'] = resolver(modalOptions.controllerUrl);
      }
      return originalOpen.apply($delegate,arguments);
    }

    return $delegate;
  }

  function resolver(fileUrl) {
    function resolveFile(lazyLoaderService) {
      return lazyLoaderService.load(fileUrl);
    }
    resolveFile.$inject = ['lazyLoaderService'];
    return resolveFile;
  }

  decorate.$inject = ['$delegate'];

  angular.module(moduleName).decorator('$uibModal', decorate);
}

},{}],6:[function(require,module,exports){
module.exports = function (moduleName) {
  function config($stateProvider) {
    $stateProvider.decorator('resolve', decorate);
  }
  config.$inject = ['$stateProvider'];

  function decorate(state, parent) {
    if (state.self.hasOwnProperty('controllerUrl'))
      state.resolve['$$lazyLoader$controller'] = resolver(state.self.controllerUrl);


    if (state.self.hasOwnProperty('views') && angular.isObject(state.self.views)) for(var viewName in state.self.views) {
      var view = state.self.views[viewName];
      if (view.hasOwnProperty('controllerUrl'))
        state.resolve['$$lazyLoader$' + viewName + '$controller'] = resolver(view.controllerUrl);
    }

    return state.resolve;
  }

  function resolver(fileUrl) {
    function resolveFile(lazyLoaderService) {
      return lazyLoaderService.load(fileUrl);
    }
    resolveFile.$inject = ['lazyLoaderService'];
    return resolveFile;
  }

  angular.module(moduleName).config(config);
}

},{}]},{},[1])