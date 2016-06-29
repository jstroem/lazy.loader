module.exports = function (moduleName) {
  function decorate($delegate) {
    var originalOpen = $delegate.open;

    $delegate.open = function(modalOptions) {
      if (modalOptions.hasOwnProperty('controllerUrl')) {
        if (modalOptions.resolve === undefined)
            modalOptions.resolve = {};
        modalOptions.resolve['$$lazyLoader$controller'] = resolver(modalOptions.controllerUrl);
      }
      return originalOpen.apply($delegate,arguments);
    }

    return $delegate;
  }

  function resolver(fileUrl) {
    function resolveFile(lazyLoaderService) {
      return lazyLoaderService.load(fileUrl);
    }
    resolveFile.$inject = ['lazyLoaderService'];
    return resolveFile;
  }

  decorate.$inject = ['$delegate'];

  angular.module(moduleName).decorator('$uibModal', decorate);
}
