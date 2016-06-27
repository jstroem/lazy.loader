angular.module('mainModule', []);

describe ('lazy.loader', function () {

  var element, scope, mockDocument, loaderService, $timeout;

  beforeEach(module('mainModule'));
  beforeEach(module('lazy.loader'));


  beforeEach(module(function($provide){
    mockDocument = {
			createElement: angular.bind(document, document.createElement),
			head: jasmine.createSpyObj('document.head', ['appendChild']),
			body: jasmine.createSpyObj('document.body', ['appendChild'])
		};
		spyOn(mockDocument, 'createElement').and.callThrough();
		$provide.value('$document', [mockDocument]);
  }));

  beforeEach(inject(function ($compile, $rootScope, lazyLoaderService, _$timeout_) {
    // vanilla
    scope = $rootScope.$new(true);
    element = angular.element('<ui-view></ui-view>');
    loaderService = lazyLoaderService;
    $timeout = _$timeout_;
    angular.element(document.body).append(element);
    $compile(element)(scope);
  }));

  describe('.lazy', function() {
    describe('.lazy.config', function() {
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

    describe('.lazy.module', function() {
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

    describe('.lazy.run', function() {
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

    describe('.lazy.init', function() {
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
    });
  });

  describe('lazyLoaderService', function() {
    //Tests same as for https://github.com/urish/angular-load
    /* License: MIT.
     * Copyright (C) 2014, Uri Shaked.
     */
    it('should append a new <' + 'script> element to the document body', function() {
			loaderService.load('https://www.test.org/somescript.js');
			expect(mockDocument.createElement).toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).toHaveBeenCalled();
			var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			expect(scriptElement.tagName.toLowerCase()).toEqual('script');
			expect(scriptElement.src).toEqual('https://www.test.org/somescript.js');
		});

		it('should resolve the returned promise as soon as the script has finished loading when `onload` callback is fired', function() {
			var resolved = false;
			loaderService.load('https://www.test.org/somescript.js').then(function() {
				resolved = true;
			});
			var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			scriptElement.onload({});
			expect(resolved).toBeFalsy();
			$timeout.flush();
			expect(resolved).toBeTruthy();
		});

		it('should resolve the returned promise as soon as the script has finished loading when `onreadystatechange` callback is fired', function() {
			var resolved = false;
			loaderService.load('https://www.test.org/somescript.js').then(function() {
				resolved = true;
			});
			var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			scriptElement.readyState = 'loading';
			scriptElement.onreadystatechange({});
			expect(resolved).toBeFalsy();
			scriptElement.readyState = 'complete';
			scriptElement.onreadystatechange({});
			$timeout.flush();
			expect(resolved).toBeTruthy();
		});

		it('should resolve the returned promise as soon as the script has finished loading when `onreadystatechange` callback is fired in IE8', function() {
			var resolved = false;
			loaderService.load('https://www.test.org/somescript.js').then(function() {
				resolved = true;
			});
			var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			scriptElement.readyState = 'loading';
			scriptElement.onreadystatechange({});
			expect(resolved).toBeFalsy();
			scriptElement.readyState = 'loaded';
			scriptElement.onreadystatechange({});
			$timeout.flush();
			expect(resolved).toBeTruthy();
		});

		it('should reject the returned promise if the script failed to load', function() {
			var rejected = false;
			loaderService.load('https://www.test.org/somescript.js').catch(function() {
				rejected = true;
			});
			var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			scriptElement.onerror({});
			expect(rejected).toBeFalsy();
			$timeout.flush();
			expect(rejected).toBeTruthy();
		});

		it('should only append the script tag once', function() {
			loaderService.load('https://www.test.org/somescript.js');
			loaderService.load('https://www.test.org/somescript.js');
			expect(mockDocument.body.appendChild.calls.all().length).toBe(1);
		});
  })

});
