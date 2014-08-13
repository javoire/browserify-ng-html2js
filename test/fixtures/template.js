(function(module) {
  try {
    module = angular.module('modulelol');
  } catch (e) {
    module = angular.module('modulelol', []);
  }
  module.run(["$templateCache", function($templateCache) {
    $templateCache.put('filenamelol',
      '<h2>lol</h2>' +
      '<p>lol</p>' +
      '');
  }]);
})();
