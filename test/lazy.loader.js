angular.module('mainModule', []);

describe ('lazy.loader', function () {

  var element, scope;

  beforeEach(function() {
    module('mainModule');
    module('lazy.loader');

    inject(function ($compile, $rootScope) {
      // vanilla
      scope = $rootScope.$new(true);
      element = angular.element('<ui-view></ui-view>');
      angular.element(document.body).append(element);
      $compile(element)(scope);
    });
  });

  describe('lazy.setup', function() {
    it('should be defined', function() {
      var lazyModule = angular.module('lazy.loader');
      expect(lazyModule).toBeDefined();
      expect(lazyModule.lazy).toBeDefined();
      expect(lazyModule.lazy.config).toBeDefined();
    });

    it('should return a config function', function() {
      var module = angular.module('mainModule');
      var lazyConfig = angular.module('lazy.loader').lazy.config(module.name);
      expect(lazyConfig).toBeDefined();
      expect(typeof lazyConfig).toBe('function');
      expect(lazyConfig.$inject).toEqual(['$controllerProvider', '$provide', '$compileProvider']);
    });

    it('should be a proper config function', function() {
      var module = angular.module('lazyModule1', ['lazy.loader']);
      var lazyModule = angular.module('lazy.loader');
      var lazyConfig = lazyModule.lazy.config(module.name);
      module.config(lazyConfig);

      //Loads the module.
      angular.injector(['ng',module.name]);

      //No errors happens.
    });

    it('should just return a noop if the config is already properly configured.', function() {
      var module = angular.module('lazyModule2', ['lazy.loader']);
      var lazyModule = angular.module('lazy.loader');
      var lazyConfig = lazyModule.lazy.config(module.name);
      expect(lazyConfig.$inject).toEqual(['$controllerProvider', '$provide', '$compileProvider']);

      module.config(lazyConfig);

      //Loads the module.
      angular.injector(['ng',module.name]);

      lazyConfig = lazyModule.lazy.config(module.name);
      expect(lazyConfig).toBe(angular.noop);
    });
  });

  describe('lazy.module', function() {
    it('should be defined', function() {
      var lazyModule = angular.module('lazy.loader');
      expect(lazyModule).toBeDefined();
      expect(lazyModule.lazy).toBeDefined();
      expect(lazyModule.lazy.module).toBeDefined();
    });

    it('should return an undefined module if the module is not configured', function() {
      var module = angular.module('lazyModule3', ['lazy.loader']);
      var lazyModule = angular.module('lazy.loader');
      expect(lazyModule.lazy.module(module.name)).toBeUndefined();
    });

    it('should return a correct instantiated module if configured', function() {
      var module = angular.module('lazyModule4',['lazy.loader']);
      var lazyModule = angular.module('lazy.loader');

      expect(lazyModule.lazy.module(module.name)).toBeUndefined();
      module.config(lazyModule.lazy.config(module.name));
      expect(lazyModule.lazy.module(module.name)).toBeUndefined();

      angular.injector(['ng',module.name]);

      expect(lazyModule.lazy.module(module.name)).toBeDefined();
      expect(lazyModule.lazy.module(module.name).controller).toBeDefined();
      expect(typeof lazyModule.lazy.module(module.name).controller).toBe('function');
      expect(lazyModule.lazy.module(module.name).directive).toBeDefined();
      expect(typeof lazyModule.lazy.module(module.name).directive).toBe('function');
      expect(lazyModule.lazy.module(module.name).service).toBeDefined();
      expect(typeof lazyModule.lazy.module(module.name).service).toBe('function');
      expect(lazyModule.lazy.module(module.name).factory).toBeDefined();
      expect(typeof lazyModule.lazy.module(module.name).factory).toBe('function');
    });
  });

  describe('lazy.run', function() {
    it('should be defined', function() {
      var lazyModule = angular.module('lazy.loader');
      expect(lazyModule).toBeDefined();
      expect(lazyModule.lazy).toBeDefined();
      expect(lazyModule.lazy.run).toBeDefined();
    });

    it('should return a function', function() {
      var module = angular.module('mainModule');
      var lazyRun = angular.module('lazy.loader').lazy.run(module.name);
      expect(lazyRun).toBeDefined();
      expect(typeof lazyRun).toBe('function');
    });

    it('should not modify the module if the module is not configured properly', function() {
      var module = angular.module('lazyModule5',['lazy.loader']);
      var lazyModule = angular.module('lazy.loader');
      var lazyRun = lazyModule.lazy.run(module.name);

      var orgMethods = {
        controller: module.controller,
        factory: module.factory,
        service: module.service,
        directive: module.directive,
      };
      var lazyRun = lazyModule.lazy.run(module.name);
      expect(lazyRun()).toBe(false);
      expect(module.controller).toBe(orgMethods.controller);
      expect(module.factory).toBe(orgMethods.factory);
      expect(module.service).toBe(orgMethods.service);
      expect(module.directive).toBe(orgMethods.directive);
    });

    it('should modify the module if the module is configured', function() {
      var module = angular.module('lazyModule6',['lazy.loader']);
      var lazyModule = angular.module('lazy.loader');
      var orgMethods = {
        controller: module.controller,
        factory: module.factory,
        service: module.service,
        directive: module.directive,
      };

      var lazyRun = lazyModule.lazy.run(module.name);
      var lazyConfig = lazyModule.lazy.config(module.name);

      module.config(lazyConfig);
      module.run(lazyRun);

      //Loads the module.
      angular.injector(['ng',module.name]);

      expect(module.controller).not.toBe(orgMethods.controller);
      expect(module.controller).toBe(lazyModule.lazy.module(module.name).controller);
      expect(module.factory).not.toBe(orgMethods.factory);
      expect(module.factory).toBe(lazyModule.lazy.module(module.name).factory);
      expect(module.service).not.toBe(orgMethods.service);
      expect(module.service).toBe(lazyModule.lazy.module(module.name).service);
      expect(module.directive).not.toBe(orgMethods.directive);
      expect(module.directive).toBe(lazyModule.lazy.module(module.name).directive);
    });
  });

  describe('lazy.init', function() {
    it('should be defined', function() {
      var lazyModule = angular.module('lazy.loader');
      expect(lazyModule).toBeDefined();
      expect(lazyModule.lazy).toBeDefined();
      expect(lazyModule.lazy.init).toBeDefined();
    });

    it('should bind the config and run handler and setup the module properly', function() {
      var module = angular.module('lazyModule7',['lazy.loader']);
      var lazyModule = angular.module('lazy.loader');
      var orgMethods = {
        controller: module.controller,
        factory: module.factory,
        service: module.service,
        directive: module.directive,
      };

      expect(module._configBlocks.length).toBe(0);
      expect(module._runBlocks.length).toBe(0);

      lazyModule.lazy.init(module.name);

      expect(module._configBlocks.length).toBe(1);
      expect(module._runBlocks.length).toBe(1);

      //Loads the module.
      angular.injector(['ng',module.name]);

      expect(module.controller).not.toBe(orgMethods.controller);
      expect(module.controller).toBe(lazyModule.lazy.module(module.name).controller);
      expect(module.factory).not.toBe(orgMethods.factory);
      expect(module.factory).toBe(lazyModule.lazy.module(module.name).factory);
      expect(module.service).not.toBe(orgMethods.service);
      expect(module.service).toBe(lazyModule.lazy.module(module.name).service);
      expect(module.directive).not.toBe(orgMethods.directive);
      expect(module.directive).toBe(lazyModule.lazy.module(module.name).directive);
    })
  })
});