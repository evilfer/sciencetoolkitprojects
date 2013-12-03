/*global angular, obj2query*/

var projectServices = angular.module('projectServices', []);

projectServices.factory('ProjectList', ['$http', function($http) {
    var defaultPeriod = 1000;
    return {
      getList: function(filter) {
        var service = {
          _filter: filter,
          projects: {},
          _updatePeriod: defaultPeriod,
          _updateTimeout: null,
          _runUpdate: function() {
            var self = this;

            window.clearTimeout(this._updateTimeout);

            $http.get('/api/projects', {
              params: {
                action: 'list',
                filter: this._filter
              }
            }).then(function(result) {
              self._answerReceived(result.data.projects);
            });
          },
          _answerReceived: function(list) {
            var self = this;
            if (!angular.equals(this.projects, list)) {
              this.projects = list;
              this._updatePeriod = defaultPeriod;
            } else {
              this._updatePeriod += defaultPeriod;
            }

            window.clearTimeout(this._updateTimeout);
            this._updateTimeout = window.setTimeout(function() {
              self._runUpdate();
            }, this._updatePeriod);
          },
          update: function() {
            this._updatePeriod = defaultPeriod;
            this._runUpdate();
          },
          destroy: function() {
            window.clearTimeout(this._updateTimeout);
          }
        };

        service.update();

        return service;
      }
    };
  }]);

projectServices.factory('ProjectCreate', ['$http', function($http) {
    return {
      create: function(projectList) {

        var service = {
          _projectList: projectList,
          working: false,
          submit: function(project) {
            service.working = true;

            var data = {
              'action': project.id ? 'update' : 'create',
              'project': project
            };

            console.log(data);

            return service._post(data, function(result) {
              service._projectList.update();
              service.working = false;
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
              service._projectList.update();
              service.working = false;
              return result.data;
            });
          },
          destroy: function() {
            this._projectList = null;
          },
          _post: function(data, success) {
            return $http.post('/api/projects', data).then(success);
          }
        };

        return service;
      }
    };
  }]);