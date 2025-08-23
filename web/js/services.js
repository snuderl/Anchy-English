'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ["ngResource"]).
  value('version', '0.1');


angular.module('myApp.services')
  .factory('Category', ['$resource',
    function($resource) {
      var resource =
        $resource('/categories/:id');
      return resource;
    }]);


 angular.module('myApp.services')
  .factory('Worksheet', ['$resource',
    function($resource) {
        return $resource("/worksheets/:id");
    }]);


  angular.module('myApp.services')
  .factory('Word', ['$resource',
    function($resource) {
        return $resource("/words/:id");
    }]);