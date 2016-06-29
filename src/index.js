var setup = require('./setup');
var loaderService = require('./service');

var mod = angular.module('lazy.loader', [])
  .service('lazyLoaderService', loaderService);
mod.lazy = setup;

module.exports = mod.name;
