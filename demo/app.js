angular.module('demo', ['lazy.loader','ui.router','ngRoute']);

//Should load before anything else.
//angular.module('lazy.loader').lazy.init('demo')
angular.module('demo')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      //url: '/',
      templateUrl: 'home.html',
      controllerUrl: 'home.js',
      controller: 'HomeController',
      controllerAs: 'vm'
    });
  }])
  // .config(['$stateProvider', function($stateProvider){
  //   $stateProvider.state('home', {
  //     url: '/',
  //     templateUrl: 'home.html',
  //     controllerUrl: 'home.js',
  //     controller: 'HomeController',
  //     controllerAs: 'vm'
  //   });
  // }]);
