/*global angular*/

angular.module('nspServices').factory('LoginService', ['$http', function($http) {
    var service = {
      status: false,
      ready: false
    };

    $http.get('/api/login', {
      params: {
        action: 'status'
      }
    }).then(function(result) {
      service.status = result.data;
      service.ready = true;
    });

    return service;
  }]);