angular.module('demo', ['lazy.loader','ui.router','ngRoute','ui.bootstrap']);

//Should load before anything else.
angular.module('lazy.loader').lazy.init('demo')
//angular.module('demo')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      //url: '/',
      templateUrl: 'home.html',
      controllerUrl: 'ngHome.js',
      controller: 'NgHomeController',
      controllerAs: 'vm'
    });
  }])
  .config(['$stateProvider', function($stateProvider){
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'home.html',
      controllerUrl: 'uiHome.js',
      controller: 'UIHomeController',
      controllerAs: 'vm'
    });
  }])
  .controller('UiBootstrap',['$scope','$uibModal', function($scope, $modal) {
    $scope.openModal = function() {
      $modal.open({
        templateUrl: 'modal.html',
        controller: 'ModalController',
        controllerUrl: 'modal.js'
      });
    }
  }])
