angular.module('demo', ['ui.router','lazy.loader']).config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'home.html',
    controllerUrl: 'home.js',
    controller: 'HomeController',
    controllerAs: 'vm'
  });
}]);
angular.module('lazy.loader').lazy.init('demo');
