/*global angular, obj2query*/

var projectServices = angular.module('projectServices', []);

projectServices.factory('ProjectList', [ '$http', function($http) {
    return {
	getList : function(filter) {
	    var service = {
		_filter : filter,
		projects : {},
		_updatePeriod : 100000,
		_updateTimeout : null,
		_runUpdate : function() {
		    var self = this;

		    window.clearTimeout(this._updateTimeout);

		    $http.get('/api/projects', {
			params : {
			    action : 'list',
			    filter : this._filter
			}
		    }).then(function(result) {
			self._answerReceived(result.data.projects);
		    });
		},
		_answerReceived : function(list) {
		    var self = this;
		    if (!angular.equals(this.projects, list)) {
			this.projects = list;
			this._updatePeriod = 100000;
		    } else {
			this._updatePeriod += 1000;
		    }

		    window.clearTimeout(this._updateTimeout);
		    this._updateTimeout = window.setTimeout(function() {
			self._runUpdate();
		    }, this._updatePeriod);
		},
		update : function() {
		    this._updatePeriod = 100000;
		    this._runUpdate();
		},
		destroy : function() {
		    window.clearTimeout(this._updateTimeout);
		}
	    };

	    service.update();

	    return service;
	}
    };
} ]);

projectServices.factory('ProjectCreate', [ '$http', function($http) {
    return {
	create : function(projectList) {

	    var service = {
		_projectList : projectList,
		working : false,

		submit : function(id, title, description, isPublic) {
		    service.working = true;

		    var data = {
			'action' : id ? 'update' : 'create',
			'id' : id,
			'title' : title,
			'description' : description,
			'is_public' : isPublic
		    };

		    return service._post(data, function(result) {
			service._projectList.update();
			console.log(result.data);
			service.working = false;
			return result.data;
		    });
		},
		joinProject : function(id) {
		    this._memberAction(id, 'join');
		},
		leaveProject : function(id) {
		    this._memberAction(id, 'leave');
		},
		_memberAction : function(id, action) {
		    service.working = true;

		    var data = {
			'action' : 'join',
			'id' : id
		    };

		    return service._post(data, function(result) {
			service._projectList.update();
			service.working = false;
			return result.data;
		    });
		},
		destroy : function() {
		    this._projectList = null;
		},
		_post : function(data, success) {
		    return $http({
			'url' : '/api/projects',
			'method' : 'POST',
			'data' : obj2query(data),
			'headers' : {
			    "Content-Type" : "application/x-www-form-urlencoded"
			}
		    }).then(success);
		}
	    };

	    return service;
	}
    };
} ]);