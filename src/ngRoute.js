module.exports = function (moduleName) {
  function run($route) {
    var routeName, route;
    for(routeName in $route.routes) {
      route = $route.routes[routeName];
      if (route.hasOwnProperty('controllerUrl')) {
        if (route.resolve === undefined)
          route.resolve = {};
        route.resolve['$$lazyLoader$controller'] = resolver(route.controllerUrl);
      }
    }
  }
  run.$inject = ['$route'];

  function resolver(fileUrl) {
    function resolveFile(lazyLoaderService) {
      return lazyLoaderService.load(fileUrl);
    }
    resolveFile.$inject = ['lazyLoaderService'];
    return resolveFile;
  }

  angular.module(moduleName).run(run);
}
