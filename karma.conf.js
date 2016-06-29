module.exports = function (config) {
  config.set({
    autoWatch: false,
    browsers: ['Chrome'],
    browserNoActivityTimeout: 30000,
    client: {
      captureConsole: true
    },
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
      'dist/index.js',
      'test/lazy.loader.js'
    ],
    logLevel: config.LOG_INFO,
    singleRun: true,

    // coverage
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
    },
    preprocessors: {
      'dist/index.js': ['coverage']
    },
    reporters: ['progress', 'coverage']
  })
}
