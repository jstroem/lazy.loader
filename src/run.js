// function resolveController(controllerUrl) {
//   function resolver($q, $timeout, $controller)  {
//     var deferred = $q.defer();
//
//     $timeout(function() {
//       var demo = angular.module('demo');
//       // angular.module('demo').run(['$controllerProvider', function($controllerProvider) {
//       //   console.log("config loaded", $controllerProvider);
//       // }]);
//
//       angular.module('demo').controller('HomeController', ['$scope','$stateParams', function($scope, $stateParams) {
//         console.log("controller loaded", $scope, $stateParams);
//       }]);
//       deferred.resolve(true);
//     },1000);
//     return deferred.promise;
//   }
//   resolver.$inject = ['$q','$timeout','$controller'];
//   return resolver;
// };
//
// function run($rootScope, $state) {
//   var stateRegistry = $state.stateRegistry;
//   var stateProvider = $state.stateProvider;
//   var stateName, state, controllerUrl;
//   for(stateName in stateRegistry.states) {
//     state = stateRegistry.states[stateName];
//     if (state.hasOwnProperty('controllerUrl')) {
//       controllerUrl = state.controllerUrl;
//       if (state.resolve === undefined)
//         state.resolve = {};
//       state.resolve['$$lazyLoader$controller'] = resolveController(controllerUrl);
//     }
//   }
// };
//
// run.$inject = ['$rootScope','$state'];
// module.exports = run;
