# lazy.loader

[![Build Status](https://travis-ci.org/jstroem/lazy.loader.svg?branch=master)](https://travis-ci.org/jstroem/lazy.loader)
[![Coverage Status](https://coveralls.io/repos/github/jstroem/lazy.loader/badge.svg?branch=master)](https://coveralls.io/github/jstroem/lazy.loader?branch=master)
![][bower]
[![npm]](https://www.npmjs.com/package/angular-lazy.loader)

[build]: https://img.shields.io/travis/project/jstroem/lazy.loader.svg?branch=master&style=flat-square
[coverage]: http://img.shields.io/coveralls/jstroem/lazy.loader.svg?branch=master&style=flat-square
[bower]: https://img.shields.io/bower/v/angular-lazy.loader.svg?style=flat-square
[npm]: https://img.shields.io/npm/v/angular-lazy.loader.svg?style=flat-square

Module for lazy loading in angular.
Makes it possible to lazy load angular elements (controllers, decorators, services, filters etc).

The project is build with support for the following modules: [`ui.router`](https://www.npmjs.com/package/angular-ui-router), [`ngRoute`](https://www.npmjs.com/package/angular-route) and [`ui.bootstrap`](https://www.npmjs.com/package/angular-ui-bootstrap).

This loader is inspired by https://github.com/urish/angular-load.

## Demo

http://jstroem.github.io/lazy.loader/demo

## Installation

via `npm`:
```
npm install angular-lazy.loader
```

via `bower`:
```
bower install angular-lazy.loader
```



## Usage

Before you can use any of the lazy-loading methods listed below you need to initialize `lazy.loader` to the angular module you want to be able to add elements to lazily.

```javascript
angular.module('moduleName', [..., 'lazy.loader']);
angular.module('lazy.loader').lazy.init('moduleName');
```

NOTE: You need to call the `lazy.init` before any other methods are used on the module.

The `.lazy.init` method returns the `moduleName` module itself so you can chain your element registrations afterwards:

```javascript
angular.module('moduleName', [..., 'lazy.loader']);
angular.module('lazy.loader').lazy.init('moduleName')
       .controller('controlelrName', function() {
         ...
       })
       .config(function() {
         ...
       });
```

### Using with ngRoute

When you define your routes you can now add  `controllerUrl` which will be loaded before the route is loaded:

```javascript
$routeProvider.when('/', {
  templateUrl: 'test.html',
  controllerUrl: 'controllers/Test.js',
  controller: 'Test',
  controllerAs: 'vm'
});
```

### Using with ui.router

When you define your states you can now add  `controllerUrl` which will be loaded before the state is loaded:

```javascript
$stateProvider.state('test', {
  url: '/test',
  templateUrl: 'test.html',
  controllerUrl: 'controllers/Test.js',
  controller: 'Test',
  controllerAs: 'vm'
});
```

This also works with multiple views:

```javascript
$stateProvider.state('test', {
  url: '/test',
  views: {
    header: {
      templateUrl: 'header.html',
      controllerUrl: 'controllers/header.js',
      controller: 'Header',
      controllerAs: 'vm'
    },
    footer: {
      templateUrl: 'footer.html',
      controllerUrl: 'controllers/footer.js',
      controller: 'footer',
      controllerAs: 'vm'
    },
  }
});
```

### Using with ui.bootstrap

When you define your modal options you can now add `controllerUrl` which will be loaded before the modal is loaded:

```javascript
$uibModal.modal({
  templateUrl: 'testModal.html',
  controllerUrl: 'controllers/TestModal.js',
  controller: 'TestModal',
  controllerAs: 'vm'
});
```

### Using the `lazyLoaderService`:

You can also load your own custom javascript files by using the `lazyLoaderService.load` method. The method returns a promise which tells if the file was loaded correctly.

```javascript
['$lazyLoaderService', function(lazyLoader) {
  lazyLoader.load('https://some.url/javascript.js').then(function(){
    console.log("success");
  }, function(){
    console.log("error");
  });
}]
```

## Running the tests

```sh
npm test
```

## Contributing

Contributions are welcome!
