/**
 * Loader service inspired by https://github.com/urish/angular-load
 */
function service($q, $document, $timeout) {
  var document = $document[0];
  var service = {};
  var cache = {};

  function onLoadHandler(element, deferred) {
    return function(e) {
      if (element.readyState && element.readyState !== 'complete' && element.readyState !== 'loaded')
				return;

      $timeout(function() {
        deferred.resolve(element);
      });
    }
  }

  function onErrorHandler(element, deferred) {
    return function (e) {
        $timeout(function() {
            deferred.reject(new Error("Couldn't load the file"));
        });
    }
  }

  service.load = function load(src) {
    if (cache[src] !== undefined)
      return cache[src];

    var deferred = $q.defer();

    var script = document.createElement('script');
		script.src = src;
		document.body.appendChild(script);

    script.onload = script.onreadystatechange = onLoadHandler(script, deferred);
    script.onerror = onErrorHandler(script, deferred);
    return cache[src] = deferred.promise;
  };

  return service;
}
service.$inject = ['$q','$document','$timeout'];

module.exports = service;
