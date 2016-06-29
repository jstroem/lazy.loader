angular.module('demo').controller('ModalController', ['$scope', '$state', function($scope, $state){
  console.log($scope.content = "modal controller init loaded via uiModal");
}]);
