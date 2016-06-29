# lazy.loader

[![Build Status](https://travis-ci.org/jstroem/lazy.loader.svg?branch=master)](https://travis-ci.org/jstroem/lazy.loader)
[![Coverage Status](https://coveralls.io/repos/github/jstroem/lazy.loader/badge.svg?branch=master)](https://coveralls.io/github/jstroem/lazy.loader?branch=master)
![][bower]
[![npm]](https://www.npmjs.com/package/angular-lazy-loader)

[build]: https://img.shields.io/travis/project/jstroem/lazy.loader.svg?branch=master&style=flat-square
[coverage]: http://img.shields.io/coveralls/jstroem/lazy.loader.svg?branch=master&style=flat-square
[bower]: https://img.shields.io/bower/v/angular-lazy-loader.svg?style=flat-square
[npm]: https://img.shields.io/npm/v/angular-lazy-loader.svg?style=flat-square

Module for lazy loading in angular.

This loader is inspired by https://github.com/urish/angular-load.

## Demo

http://jstroem.github.io/lazy.loader/demo

## Installation

TBA.

## Usage

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
## Running the tests

```sh
npm test
```

## Contributing

Contributions are welcome!
