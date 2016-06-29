angular.module('demo').controller('UIHomeController', ['$scope', '$state', function($scope, $state){
  console.log($scope.content = "Home controller init loaded via ui.router");
}]);
