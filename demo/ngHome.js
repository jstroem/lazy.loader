angular.module('demo').controller('NgHomeController', ['$scope', '$state', function($scope, $state){
  console.log($scope.content = "Home controller init loaded via ngRoute");
}]);
