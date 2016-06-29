describe ('lazy.loader', function () {

  var mockDocument;

  beforeEach(module(function($provide){
    mockDocument = {
			createElement: angular.bind(document, document.createElement),
      addEventListener: angular.bind(document, document.addEventListener),
			head: jasmine.createSpyObj('document.head', ['appendChild']),
			body: jasmine.createSpyObj('document.body', ['appendChild'])
		};
		spyOn(mockDocument, 'createElement').and.callThrough();
		$provide.value('$document', [mockDocument]);
  }));

  describe('.lazy', function() {
    var lazyModule, mainModule;

    beforeEach(function() {
      lazyModule = angular.module('lazy.loader');
      lazyModule.lazy.reset();
      mainModule = angular.module('mainModule', ['lazy.loader']);
    });

    describe('.config', function() {
      it('should be defined', function() {
        expect(lazyModule).toBeDefined();
        expect(lazyModule.lazy).toBeDefined();
        expect(lazyModule.lazy.config).toBeDefined();
      });

      it('should return a config function', function() {
        var lazyConfig = angular.module('lazy.loader').lazy.config(mainModule.name);
        expect(lazyConfig).toBeDefined();
        expect(typeof lazyConfig).toBe('function');
        expect(lazyConfig.$inject).toEqual(['$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$animateProvider']);
      });

      it('should be a proper config function', function() {
        var lazyConfig = lazyModule.lazy.config(mainModule.name);
        mainModule.config(lazyConfig);
        //Loads the module.
        angular.injector(['ng',mainModule.name]);
        //No errors happens.
      });

      it('should return angular.noop if the module did not exists', function() {
        var lazyConfig = angular.module('lazy.loader').lazy.config('FakeModuleName');
        expect(lazyConfig).toBe(angular.noop);
      });

      it('should just return a noop if the config is already properly configured.', function() {
        var lazyConfig = lazyModule.lazy.config(mainModule.name);
        expect(lazyConfig.$inject).toEqual(['$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$animateProvider']);

        mainModule.config(lazyConfig);

        //Loads the module.
        angular.injector(['ng',mainModule.name]);

        lazyConfig = lazyModule.lazy.config(mainModule.name);
        expect(lazyConfig).toBe(angular.noop);
      });

      it('should overwrite the lazyModule hooks if already configured.', function() {
        var lazyConfig = lazyModule.lazy.config(mainModule.name);
        var called = false;
        var decorator = function() {
          called = true;

          var mod1 = lazyModule.lazy.module(mainModule.name), mod2;
          expect(mod1).toBeUndefined();
          expect(lazyConfig.apply(null, arguments)).toBeTruthy();

          mod1 = lazyModule.lazy.module(mainModule.name);
          expect(mod1).toBeDefined();

          expect(lazyConfig.apply(null, arguments)).toBeFalsy();
          mod2 = lazyModule.lazy.module(mainModule.name);
          expect(mod2).toBeDefined();

          expect(mod1).toBe(mod2);
        }
        decorator.$inject = lazyConfig.$inject;
        mainModule.config(decorator);

        expect(called).toBeFalsy();
        //Loads the mainModule.
        angular.injector(['ng',mainModule.name]);

        expect(called).toBeTruthy();
      });
    });

    describe('.module', function() {
      it('should be defined', function() {
        expect(lazyModule).toBeDefined();
        expect(lazyModule.lazy).toBeDefined();
        expect(lazyModule.lazy.module).toBeDefined();
      });

      it('should return an undefined module if the module is not configured', function() {
        expect(lazyModule.lazy.module(mainModule.name)).toBeUndefined();
      });

      it('should return a correct instantiated module if configured', function() {
        expect(lazyModule.lazy.module(mainModule.name)).toBeUndefined();
        mainModule.config(lazyModule.lazy.config(mainModule.name));
        expect(lazyModule.lazy.module(mainModule.name)).toBeUndefined();

        angular.injector(['ng',mainModule.name]);

        expect(lazyModule.lazy.module(mainModule.name)).toBeDefined();

        expect(lazyModule.lazy.module(mainModule.name).controller).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).controller).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).factory).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).factory).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).service).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).service).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).decorator).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).decorator).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).constant).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).constant).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).value).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).value).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).provider).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).provider).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).directive).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).directive).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).component).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).component).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).animation).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).animation).toBe('function');

        expect(lazyModule.lazy.module(mainModule.name).filter).toBeDefined();
        expect(typeof lazyModule.lazy.module(mainModule.name).filter).toBe('function');
      });
    });

    describe('.run', function() {
      it('should be defined', function() {
        expect(lazyModule).toBeDefined();
        expect(lazyModule.lazy).toBeDefined();
        expect(lazyModule.lazy.run).toBeDefined();
      });

      it('should return a function', function() {
        var lazyRun = angular.module('lazy.loader').lazy.run(mainModule.name);
        expect(lazyRun).toBeDefined();
        expect(typeof lazyRun).toBe('function');
      });

      it('should return angular.noop if the module did not exists', function() {
        var lazyRun = angular.module('lazy.loader').lazy.run('FakeModuleName');
        expect(lazyRun).toBe(angular.noop);
      });

      it('should not modify the module if the module is not configured properly', function() {
        var lazyRun = lazyModule.lazy.run(mainModule.name);

        var orgMethods = {
          controller: mainModule.controller,
          factory: mainModule.factory,
          service: mainModule.service,
          decorator: mainModule.decorator,
          constant: mainModule.constant,
          value: mainModule.value,
          provider: mainModule.provider,
          directive: mainModule.directive,
          component: mainModule.component,
          animation: mainModule.animation,
          filter: mainModule.filter,
        };
        var lazyRun = lazyModule.lazy.run(mainModule.name);
        expect(lazyRun()).toBe(false);
        expect(mainModule.controller).toBe(orgMethods.controller);
        expect(mainModule.factory).toBe(orgMethods.factory);
        expect(mainModule.service).toBe(orgMethods.service);
        expect(mainModule.decorator).toBe(orgMethods.decorator);
        expect(mainModule.constant).toBe(orgMethods.constant);
        expect(mainModule.value).toBe(orgMethods.value);
        expect(mainModule.provider).toBe(orgMethods.provider);
        expect(mainModule.directive).toBe(orgMethods.directive);
        expect(mainModule.component).toBe(orgMethods.component);
        expect(mainModule.animation).toBe(orgMethods.animation);
        expect(mainModule.filter).toBe(orgMethods.filter);
      });

      it('should modify the module if the module is configured', function() {
        var orgMethods = {
          controller: mainModule.controller,
          factory: mainModule.factory,
          service: mainModule.service,
          decorator: mainModule.decorator,
          constant: mainModule.constant,
          value: mainModule.value,
          provider: mainModule.provider,
          directive: mainModule.directive,
          component: mainModule.component,
          animation: mainModule.animation,
          filter: mainModule.filter,
        };

        var lazyRun = lazyModule.lazy.run(mainModule.name);
        var lazyConfig = lazyModule.lazy.config(mainModule.name);

        mainModule.config(lazyConfig);
        mainModule.run(lazyRun);

        //Loads the mainModule.
        angular.injector(['ng',mainModule.name]);

        expect(mainModule.controller).not.toBe(orgMethods.controller);
        expect(mainModule.controller).toBe(lazyModule.lazy.module(mainModule.name).controller);
        expect(mainModule.factory).not.toBe(orgMethods.factory);
        expect(mainModule.factory).toBe(lazyModule.lazy.module(mainModule.name).factory);
        expect(mainModule.service).not.toBe(orgMethods.service);
        expect(mainModule.service).toBe(lazyModule.lazy.module(mainModule.name).service);
        expect(mainModule.decorator).not.toBe(orgMethods.decorator);
        expect(mainModule.decorator).toBe(lazyModule.lazy.module(mainModule.name).decorator);
        expect(mainModule.constant).not.toBe(orgMethods.constant);
        expect(mainModule.constant).toBe(lazyModule.lazy.module(mainModule.name).constant);
        expect(mainModule.value).not.toBe(orgMethods.value);
        expect(mainModule.value).toBe(lazyModule.lazy.module(mainModule.name).value);
        expect(mainModule.provider).not.toBe(orgMethods.provider);
        expect(mainModule.provider).toBe(lazyModule.lazy.module(mainModule.name).provider);
        expect(mainModule.directive).not.toBe(orgMethods.directive);
        expect(mainModule.directive).toBe(lazyModule.lazy.module(mainModule.name).directive);
        expect(mainModule.component).not.toBe(orgMethods.component);
        expect(mainModule.component).toBe(lazyModule.lazy.module(mainModule.name).component);
        expect(mainModule.animation).not.toBe(orgMethods.animation);
        expect(mainModule.animation).toBe(lazyModule.lazy.module(mainModule.name).animation);
        expect(mainModule.filter).not.toBe(orgMethods.filter);
        expect(mainModule.filter).toBe(lazyModule.lazy.module(mainModule.name).filter);
      });
    });

    describe('.init', function() {
      it('should be defined', function() {
        expect(lazyModule).toBeDefined();
        expect(lazyModule.lazy).toBeDefined();
        expect(lazyModule.lazy.init).toBeDefined();
      });

      it('should not bind the config and run handler if the module did not exists', function() {
        expect(lazyModule.lazy.init('FakeModuleName')).toBeUndefined();
      });

      it('should bind the config and run handler and setup the module properly', function() {
        var orgMethods = {
          controller: mainModule.controller,
          factory: mainModule.factory,
          service: mainModule.service,
          decorator: mainModule.decorator,
          constant: mainModule.constant,
          value: mainModule.value,
          provider: mainModule.provider,
          directive: mainModule.directive,
          component: mainModule.component,
          animation: mainModule.animation,
          filter: mainModule.filter,
        };

        expect(mainModule._configBlocks.length).toBe(0);
        expect(mainModule._runBlocks.length).toBe(0);

        //Should return the module itself.
        expect(lazyModule.lazy.init(mainModule.name)).toBe(mainModule);

        expect(mainModule._configBlocks.length).toBe(1);

        //Should ONLY bind one runner since no modules was included.
        expect(mainModule._runBlocks.length).toBe(1);

        //Loads the mainModule.
        angular.injector(['ng',mainModule.name]);

        expect(mainModule.controller).not.toBe(orgMethods.controller);
        expect(mainModule.controller).toBe(lazyModule.lazy.module(mainModule.name).controller);
        expect(mainModule.factory).not.toBe(orgMethods.factory);
        expect(mainModule.factory).toBe(lazyModule.lazy.module(mainModule.name).factory);
        expect(mainModule.service).not.toBe(orgMethods.service);
        expect(mainModule.service).toBe(lazyModule.lazy.module(mainModule.name).service);
        expect(mainModule.decorator).not.toBe(orgMethods.decorator);
        expect(mainModule.decorator).toBe(lazyModule.lazy.module(mainModule.name).decorator);
        expect(mainModule.constant).not.toBe(orgMethods.constant);
        expect(mainModule.constant).toBe(lazyModule.lazy.module(mainModule.name).constant);
        expect(mainModule.value).not.toBe(orgMethods.value);
        expect(mainModule.value).toBe(lazyModule.lazy.module(mainModule.name).value);
        expect(mainModule.provider).not.toBe(orgMethods.provider);
        expect(mainModule.provider).toBe(lazyModule.lazy.module(mainModule.name).provider);
        expect(mainModule.directive).not.toBe(orgMethods.directive);
        expect(mainModule.directive).toBe(lazyModule.lazy.module(mainModule.name).directive);
        expect(mainModule.component).not.toBe(orgMethods.component);
        expect(mainModule.component).toBe(lazyModule.lazy.module(mainModule.name).component);
        expect(mainModule.animation).not.toBe(orgMethods.animation);
        expect(mainModule.animation).toBe(lazyModule.lazy.module(mainModule.name).animation);
        expect(mainModule.filter).not.toBe(orgMethods.filter);
        expect(mainModule.filter).toBe(lazyModule.lazy.module(mainModule.name).filter);
      });
    });

    describe('lazy methods', function() {
      describe('.controller register on a angularModule', function( ){
        var $controller;
        beforeEach(function() {
           mainModule.run(['$controller', function(ctrl){
             $controller = ctrl;
           }]);
        });

        function hasController(name) {
          try {
            $controller(name, {'$scope': {}}, true);
            return true;
          } catch(e) {
            return false;
          }
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasController('test')).toBe(false);
          mainModule.controller('test', function() {});
          expect(hasController('test')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasController('test')).toBe(false);
          mainModule.controller('test', function() {});
          expect(hasController('test')).toBe(true);
        });
      });

      describe('.factory register on a angularModule', function() {
        var $injector;

        beforeEach(function(){
          mainModule.run(['$injector', function(cmpl) {
            $injector = cmpl;
          }])
        });

        function hasFactory(name) {
          return $injector.has(name);
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasFactory('testFactory')).toBe(false);
          mainModule.factory('testFactory', function() {
            this.$get = function() {}
          });
          expect(hasFactory('testFactory')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasFactory('testFactory')).toBe(false);
          mainModule.factory('testFactory', function() {
            this.$get = function() {}
          });
          expect(hasFactory('testFactory')).toBe(true);
        });
      });

      describe('.service register on a angularModule', function() {
        var $injector;

        beforeEach(function(){
          mainModule.run(['$injector', function(cmpl) {
            $injector = cmpl;
          }])
        });

        function hasService(name) {
          return $injector.has(name);
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasService('testService')).toBe(false);
          mainModule.service('testService', function() {
            return function() {}
          });
          expect(hasService('testService')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasService('testService')).toBe(false);
          mainModule.service('testService', function() {
            return function() {}
          });
          expect(hasService('testService')).toBe(true);
        });
      });

      describe('.decorator register on a angularModule', function() {
        //Not testable currently
      });

      describe('.constant register on a angularModule', function() {
        var $injector;

        beforeEach(function(){
          mainModule.run(['$injector', function(cmpl) {
            $injector = cmpl;
          }])
        });

        function getConstant(name) {
          if ($injector.has(name))
            return $injector.get(name);
          return undefined;
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(getConstant('testConstant')).toBe(undefined);
          mainModule.constant('testConstant','value1');
          expect(getConstant('testConstant')).toBe(undefined);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(getConstant('testConstant')).toBe(undefined);
          mainModule.constant('testConstant','value1');
          expect(getConstant('testConstant')).toBe('value1');
        });
      });

      describe('.value register on a angularModule', function() {
        var $injector;

        beforeEach(function(){
          mainModule.run(['$injector', function(cmpl) {
            $injector = cmpl;
          }])
        });

        function getValue(name) {
          if ($injector.has(name))
            return $injector.get(name);
          return undefined;
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(getValue('testValue')).toBe(undefined);
          mainModule.constant('testValue','value1');
          expect(getValue('testValue')).toBe(undefined);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(getValue('testValue')).toBe(undefined);
          mainModule.constant('testValue','value1');
          expect(getValue('testValue')).toBe('value1');
        });
      });

      describe('.provider register on a angularModule', function() {
        var $injector;

        beforeEach(function(){
          mainModule.run(['$injector', function(cmpl) {
            $injector = cmpl;
          }])
        });

        function hasProvider(name) {
          return $injector.has(name);
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasProvider('testProvider')).toBe(false);
          mainModule.provider('testProvider', function() {
            this.$get = function() {}
          });
          expect(hasProvider('testProvider')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasProvider('testProvider')).toBe(false);
          mainModule.provider('testProvider', function() {
            this.$get = function() {}
          });
          expect(hasProvider('testProvider')).toBe(true);
        });
      });

      describe('.directive register on a angularModule', function() {
        var $injector;

        beforeEach(function(){
          mainModule.run(['$injector', function(cmpl) {
            $injector = cmpl;
          }])
        });

        function hasDirective(name) {
          return $injector.has(name+'Directive');
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasDirective('test')).toBe(false);
          mainModule.directive('test', function() { return { template:'' }; });
          expect(hasDirective('test')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasDirective('test')).toBe(false);
          mainModule.directive('test', function() { return { template:'' }; });
          expect(hasDirective('test')).toBe(true);
        });
      });

      describe('.component register on a angularModule', function() {
        var $injector;

        beforeEach(function(){
          mainModule.run(['$injector', function(cmpl) {
            $injector = cmpl;
          }])
        });

        function hasComponent(name) {
          return $injector.has(name+'Directive');
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasComponent('test')).toBe(false);
          mainModule.component('test', { template:'' });
          expect(hasComponent('test')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasComponent('test')).toBe(false);
          mainModule.component('test', { template:'' });
          expect(hasComponent('test')).toBe(true);
        });
      });

      describe('.animation register on a angularModule', function() {
        var $animateProvider;

        beforeEach(function(){
          mainModule.config(['$animateProvider', function(anim) {
            $animateProvider = anim;
          }])
        });

        function hasAnimation(name) {
          return $animateProvider.$$registeredAnimations[name] !== undefined;
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasAnimation('testAnimation')).toBe(false);
          mainModule.animation('.testAnimation', { });
          expect(hasAnimation('testAnimation')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasAnimation('testAnimation')).toBe(false);
          mainModule.animation('.testAnimation', { });
          expect(hasAnimation('testAnimation')).toBe(true);
        });
      });

      describe('.filter register on a angularModule', function() {
        var $filter;

        beforeEach(function(){
          mainModule.run(['$filter', function(fil) {
            $filter = fil;
          }])
        });

        function hasFilter(name) {
          try {
            $filter(name);
            return true;
          } catch(e) {
            return false;
          }
        }

        it('should not be able to call before lazyModule is initiated.', function() {
          //Loads the mainModule.
          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasFilter('testFilter')).toBe(false);
          mainModule.filter('testFilter', function(){ return function() { } });
          expect(hasFilter('testFilter')).toBe(false);
        });

        it('should be able to call after lazyModule is initiated.', function() {
          //Loads the mainModule.
          lazyModule.lazy.init(mainModule.name);

          angular.bootstrap(mockDocument, [mainModule.name]);
          expect(hasFilter('testFilter')).toBe(false);
          mainModule.filter('testFilter', function(){ return function() { } });
          expect(hasFilter('testFilter')).toBe(true);
        });
      });
    });
  });

  describe('lazyLoaderService', function() {
    /* Tests same as for https://github.com/urish/angular-load
     * Copyright (C) 2014, Uri Shaked.
     */
     beforeEach(module('lazy.loader'));
     var $timeout, loaderService;
     beforeEach(inject(function(lazyLoaderService, _$timeout_) {
       loaderService = lazyLoaderService;
       $timeout = _$timeout_;
     }));

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
  });

  describe('uiRouterHandler', function() {
    beforeEach(module('lazy.loader'));

    var lazyModule, mainModule;
    beforeEach(function() {
      lazyModule = angular.module('lazy.loader');
      lazyModule.lazy.reset();
      mainModule = angular.module('mainModule', ['lazy.loader','ui.router'], function($provide) {
        $provide.value('lazyLoaderService', loaderService);
      });
    });

    var scope, element, loaderService, $timeout;
    beforeEach(inject(function ($compile, $rootScope, lazyLoaderService, _$timeout_) {
      scope = $rootScope.$new(true);
      loaderService = lazyLoaderService;
      $timeout = _$timeout_;
      element = angular.element('<ui-view></ui-view>');
      angular.element(document.body).append(element);
      $compile(element)(scope);
    }));

    it('should bind another runner once configured with ui.router as a dependecy', function() {
      expect(mainModule._configBlocks.length).toBe(1);
      expect(mainModule._runBlocks.length).toBe(0);

      expect(lazyModule.lazy.init(mainModule.name)).toBe(mainModule);

      expect(mainModule._runBlocks.length).toBe(1);
      //Should bind another config since ui.router is included.
      expect(mainModule._configBlocks.length).toBe(3);
    });

    it('should not decorate states without controllerUrl', function() {
      var $state = undefined;

      lazyModule.lazy.init(mainModule.name)
        .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('test1', {
          url: '/',
          template: 'test',
        });

      }]).run(['$state', function($s){
        $state = $s;
      }]);

      angular.bootstrap(mockDocument, [mainModule.name]);

      $state.go('test1');

      expect(mockDocument.createElement).not.toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).not.toHaveBeenCalled();
    });

    it('should decorate the resolve object and load the file once gone to.', function() {
      var $state = undefined;
      lazyModule.lazy.init(mainModule.name)
        .config(['$stateProvider','$provide', function($stateProvider,$provide) {
        $stateProvider.state('test1', {
          url: '/',
          template: 'test',
          controllerUrl: 'https://www.test.org/somescript.js'
        });

      }]).run(['$state', function($s){
        $state = $s;
      }]);

      angular.bootstrap(mockDocument, [mainModule.name]);

      expect(mockDocument.createElement).not.toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).not.toHaveBeenCalled();

      $state.go('test1');

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).toHaveBeenCalled();
    });

    it('should change the state once the script is loaded', function() {
      var $state = undefined, $rootScope;

      lazyModule.lazy.init(mainModule.name)
        .config(['$stateProvider','$provide', function($stateProvider,$provide) {
        $stateProvider.state('test1', {
          url: '/',
          template: 'test',
          controllerUrl: 'https://www.test.org/somescript.js'
        });

      }]).run(['$state','$rootScope', function($s,$rs){
        $state = $s, $rootScope = $rs;
      }]);

      angular.bootstrap(mockDocument, [mainModule.name]);

      $state.go('test1');
      $rootScope.$apply();

      expect($state.current.name).toBe('');
      expect($state.current.abstract).toBe(true);

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).toHaveBeenCalled();
      var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			expect(scriptElement.tagName.toLowerCase()).toEqual('script');
			expect(scriptElement.src).toEqual('https://www.test.org/somescript.js');
      scriptElement.readyState = 'loaded';
      scriptElement.onreadystatechange({});
      $timeout.flush();
      $rootScope.$apply();

      expect($state.current.name).toBe('test1');
    });

    it('should not change the script if the load failed', function() {
      var $state = undefined, $rootScope;

      lazyModule.lazy.init(mainModule.name)
        .config(['$stateProvider','$provide', function($stateProvider,$provide) {
        $stateProvider.state('test1', {
          url: '/',
          template: 'test',
          controllerUrl: 'https://www.test.org/somescript.js'
        });

      }]).run(['$state','$rootScope', function($s,$rs){
        $state = $s, $rootScope = $rs;
      }]);

      angular.bootstrap(mockDocument, [mainModule.name]);

      $state.go('test1');
      $rootScope.$apply();

      expect($state.current.name).toBe('');
      expect($state.current.abstract).toBe(true);

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
      expect(mockDocument.body.appendChild).toHaveBeenCalled();
      var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
      expect(scriptElement.tagName.toLowerCase()).toEqual('script');
      expect(scriptElement.src).toEqual('https://www.test.org/somescript.js');
      scriptElement.onerror({});
      $timeout.flush();
      $rootScope.$apply();

      expect($state.current.name).toBe('');
      expect($state.current.abstract).toBe(true);
    });
  });

  describe('ngRouteHandler', function() {
    beforeEach(module('lazy.loader'));

    var lazyModule, mainModule;
    beforeEach(function() {
      lazyModule = angular.module('lazy.loader');
      lazyModule.lazy.reset();
      mainModule = angular.module('mainModule', ['lazy.loader','ngRoute'], function($provide) {
        $provide.value('lazyLoaderService', loaderService);
      });
    });

    var scope, element, loaderService, $timeout;
    beforeEach(inject(function ($compile, $rootScope, lazyLoaderService, _$timeout_) {
      scope = $rootScope.$new(true);
      loaderService = lazyLoaderService;
      $timeout = _$timeout_;
      element = angular.element('<ng-view></ng-view>');
      angular.element(document.body).append(element);
      $compile(element)(scope);
    }));

    it('should bind another config once configured with ui.router as a dependecy', function() {
      expect(mainModule._configBlocks.length).toBe(1);
      expect(mainModule._runBlocks.length).toBe(0);

      expect(lazyModule.lazy.init(mainModule.name)).toBe(mainModule);

      //Should bind another runner since ngRoute is included.
      expect(mainModule._runBlocks.length).toBe(2);
      expect(mainModule._configBlocks.length).toBe(2);
    });

    it('should not add resolve to states without controllerUrl', function() {
      var $route = undefined;

      lazyModule.lazy.init(mainModule.name)
        .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
          template: 'test',
        });

      }]).run(['$route', function($s){
        $route = $s;
      }]);

      angular.bootstrap(mockDocument, [mainModule.name]);

      expect($route).toBeDefined();
      expect($route.current.resolve).toBeUndefined();

      expect(mockDocument.createElement).not.toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).not.toHaveBeenCalled();
    });

    it('should add a resolver and load the file once the route is shown.', function() {
      var $route, $routeScope, $location;

      lazyModule.lazy.init(mainModule.name)
        .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/test1', {
          template: 'test',
          controllerUrl: 'https://www.test.org/somescript.js'
        });
      }]).run(['$route','$rootScope','$location', function($s,$rs, $l){
        $route = $s, $rootScope = $rs, $location = $l;
      }]);

      expect(mockDocument.createElement).not.toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).not.toHaveBeenCalled();

      angular.bootstrap(mockDocument, [mainModule.name]);

      expect($route).toBeDefined();
      expect($route.routes['/test1'].resolve).toBeDefined();
      expect($route.routes['/test1'].resolve['$$lazyLoader$controller']).toBeDefined();

      $location.path('/test1');
      $rootScope.$digest();

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).toHaveBeenCalled();
    });

    it('should change the $route once the script is loaded.', function() {
      var $route, $routeScope, $location;

      lazyModule.lazy.init(mainModule.name)
        .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/test1', {
          template: 'test',
          controllerUrl: 'https://www.test.org/somescript.js'
        });
      }]).run(['$route','$rootScope','$location', function($s,$rs, $l){
        $route = $s, $rootScope = $rs, $location = $l;
      }]);

      expect(mockDocument.createElement).not.toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).not.toHaveBeenCalled();

      angular.bootstrap(mockDocument, [mainModule.name]);

      expect($route).toBeDefined();
      expect($route.routes['/test1'].resolve).toBeDefined();
      expect($route.routes['/test1'].resolve['$$lazyLoader$controller']).toBeDefined();

      $location.path('/test1');
      $rootScope.$digest();


      expect($route.current.locals).toBeUndefined();

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).toHaveBeenCalled();
      var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			expect(scriptElement.tagName.toLowerCase()).toEqual('script');
			expect(scriptElement.src).toEqual('https://www.test.org/somescript.js');
      scriptElement.readyState = 'loaded';
      scriptElement.onreadystatechange({});
      $timeout.flush();
      $rootScope.$digest();
      expect($route.current.locals).toBeDefined();
      expect($route.current.locals['$$lazyLoader$controller']).toBeDefined();
    });

    it('should not change the #route if the script fails to load.', function() {
      var $route, $routeScope, $location;

      lazyModule.lazy.init(mainModule.name)
        .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/test1', {
          template: 'test',
          controllerUrl: 'https://www.test.org/somescript.js'
        });
      }]).run(['$route','$rootScope','$location', function($s,$rs, $l){
        $route = $s, $rootScope = $rs, $location = $l;
      }]);

      expect(mockDocument.createElement).not.toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).not.toHaveBeenCalled();

      angular.bootstrap(mockDocument, [mainModule.name]);

      expect($route).toBeDefined();
      expect($route.routes['/test1'].resolve).toBeDefined();
      expect($route.routes['/test1'].resolve['$$lazyLoader$controller']).toBeDefined();

      $location.path('/test1');
      $rootScope.$digest();


      expect($route.current.locals).toBeUndefined();

      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).toHaveBeenCalled();
      var scriptElement = mockDocument.body.appendChild.calls.mostRecent().args[0];
			expect(scriptElement.tagName.toLowerCase()).toEqual('script');
			expect(scriptElement.src).toEqual('https://www.test.org/somescript.js');
      scriptElement.onerror({});
      $timeout.flush();
      $rootScope.$digest();

      expect($route.current.locals).toBeUndefined();
    });
  })

  describe('uiBootstrapHandler', function() {
    beforeEach(module('lazy.loader'));

    var lazyModule, mainModule;
    beforeEach(function() {
      lazyModule = angular.module('lazy.loader');
      lazyModule.lazy.reset();
      mainModule = angular.module('mainModule', ['lazy.loader','ui.bootstrap'], function($provide) {
        $provide.value('lazyLoaderService', loaderService);
      });
    });

    var scope, loaderService, $timeout;
    beforeEach(inject(function ($rootScope, lazyLoaderService, _$timeout_) {
      scope = $rootScope.$new(true);
      loaderService = lazyLoaderService;
      $timeout = _$timeout_;
    }));


    it('should not add resolve to the modalOptions without controllerUrl', function() {
      var $uibModal = undefined;

      lazyModule.lazy.init(mainModule.name)
      .run(['$uibModal', function($s){
        $uibModal = $s;
      }]);

      angular.bootstrap(mockDocument, [mainModule.name]);

      var modalOptions = {
        template: 'test'
      };

      $uibModal.open(modalOptions);
      expect(modalOptions.resolve).toBeUndefined();
    });

    it('should add a resolver and load the file once the modal.open is called.', function() {
      var $uibModal = undefined;

      lazyModule.lazy.init(mainModule.name)
      .run(['$uibModal', function($s){
        $uibModal = $s;
      }]);

      angular.bootstrap(mockDocument, [mainModule.name]);

      var modalOptions = {
        template: 'test',
        controllerUrl: 'https://www.test.org/somescript.js'
      };

      $uibModal.open(modalOptions);
      expect(modalOptions.resolve).toBeDefined();
      expect(modalOptions.resolve['$$lazyLoader$controller']).toBeDefined();
      expect(mockDocument.createElement).toHaveBeenCalledWith('script');
			expect(mockDocument.body.appendChild).toHaveBeenCalled();
    });
  });
});
