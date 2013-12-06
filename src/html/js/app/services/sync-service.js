/*global angular*/


angular.module('nspServices').factory('SyncService', ['$http', function($http) {

    var service = {
      status: false,
      ready: false,
      data: false,
      updating: false
    };

    service.updater = new nspUpdater($http, '/api/projects', {
      onUpdate: function() {
        service.updating = true;
      },
      onSuccess: function(data) {
        if (!angular.equals(data, service.data)) {
          service.data = data;
          service.ready = true;
          service.updating = false;
        }
      }
    });

    service.stop = function() {
      this.updater.stop();
    };

    service._update = function(data, periodic, onchange) {
      this.updater.stop();
      this.updater.setRequestData(data);
      this.updater.updateNow(periodic, onchange);
    };

    service.getProject = function(projectId, periodic, onchange) {
      this._update({action: 'get', id: projectId}, periodic, onchange);
    };

    service.getList = function(filter, periodic, onchange) {
      this._update({action: 'list', filter: filter}, periodic, onchange);
    };

    service.somethingChanged = function() {
      this.updater.somethingChanged();
    };


    $http.get('/api/login', {
      params: {
        action: 'status'
      }
    }).then(function(result) {
      service.ready = true;
      service.status = result.data;
    });

    return service;
  }]);