var setup = require('./setup');

var mod = angular.module('lazy.loader', []).config(setup.reset);
mod.lazy = setup;

module.exports = mod.name;
