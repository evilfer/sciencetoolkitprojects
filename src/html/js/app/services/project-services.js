/*global angular, obj2query*/

var projectServices = angular.module('projectServices', []);

projectServices.factory('ProjectList', ['$http', function($http) {
    return {
      getList: function(filter) {

        var service = {
          projects: {},
          update: function() {
            this.updater.updateNow();
          },
          destroy: function() {
            this.updater.destroy();
          },
          updateList: function(data) {
            var newData = !angular.equals(service.projects, data.projects);

            if (newData) {
              service.projects = data.projects;
            }

            return newData;
          }
        };

        service.updater = new nspUpdater($http, '/api/projects', {
          params: {
            action: 'list',
            filter: filter
          }
        }, function(data) {
          return service.updateList(data);
        });

        service.update();

        return service;
      }
    };
  }]);

projectServices.factory('ProjectCreate', ['$http', function($http) {
    return {
      create: function(updateListener) {
        var service = {
          _updateListener: updateListener,
          working: false,
          submit: function(project) {
            service.working = true;

            var data = {
              'action': project.id ? 'update' : 'create',
              'project': project
            };

            console.log(data);

            return service._post(data, function(result) {
              service.working = false;
              service._update();
              return result.data;
            });
          },
          joinProject: function(id) {
            this._memberAction(id, 'join');
          },
          leaveProject: function(id) {
            this._memberAction(id, 'leave');
          },
          _memberAction: function(id, action) {
            service.working = true;

            var data = {
              'action': action,
              'id': id
            };

            return service._post(data, function(result) {
              service.working = false;
              service._update();
              return result.data;
            });
          },
          destroy: function() {
            this._projectList = null;
          },
          _post: function(data, success) {
            return $http.post('/api/projects', data).then(success);
          },
          _update: function() {
            if (this._updateListener) {
              this._updateListener.update();
            }
          }
        };

        return service;
      }
    };
  }]);

projectServices.factory('ProjectGet', ['$http', function($http) {
    var service = {
      getProject: function(projectId) {
        return $http.get('/api/projects', {
          params: {
            action: 'get',
            id: projectId
          }
        }).then(function(result) {
          return result.data;
        });
      }
    };

    return service;
  }]);

projectServices.factory('ProjectGetSync', ['$http', function($http) {
    return {
      get: function(projectId) {

        var service = {
          projectId: projectId,
          data: {},
          update: function() {
            this.updater.updateNow();
          },
          destroy: function() {
            this.updater.destroy();
          },
          _receiveUpdate: function(data) {
            var newData = !angular.equals(service.data, data);

            if (newData) {
              service.data = data;
            }

            return newData;
          }
        };

        service.updater = new nspUpdater($http, '/api/projects', {
          params: {
            action: 'get',
            id: service.projectId
          }
        }, function(data) {
          return service._receiveUpdate(data);
        });

        service.update();

        return service;
      }
    };
  }]);