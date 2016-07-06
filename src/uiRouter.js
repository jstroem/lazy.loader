module.exports = function (moduleName) {
  function config($stateProvider) {
    $stateProvider.decorator('resolve', decorate);
  }
  config.$inject = ['$stateProvider'];

  function decorate(state, parent) {
    if (state.self.hasOwnProperty('controllerUrl'))
      state.resolve['$$lazyLoader$controller'] = resolver(state.self.controllerUrl);


    if (state.self.hasOwnProperty('views') && angular.isObject(state.self.views)) for(var viewName in state.self.views) {
      var view = state.self.views[viewName];
      if (view.hasOwnProperty('controllerUrl'))
        state.resolve['$$lazyLoader$' + viewName + '$controller'] = resolver(view.controllerUrl);
    }

    return state.resolve;
  }

  function resolver(fileUrl) {
    function resolveFile(lazyLoaderService) {
      return lazyLoaderService.load(fileUrl);
    }
    resolveFile.$inject = ['lazyLoaderService'];
    return resolveFile;
  }

  angular.module(moduleName).config(config);
}
