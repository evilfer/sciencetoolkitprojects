/*global angular*/

var loginServices = angular.module('loginServices', []);

loginServices.factory('LoginStatus', [ '$http', function($http) {
    var service = {
	_data : false,

	getStatus : function() {
	    return this._data ? this._data : $http.get('/api/login', {
		params : {
		    action : 'status'
		}
	    }).then(function(result) {
		service._data = result.data;
		return service._data;
	    });
	}

    };

    return service;
} ]);