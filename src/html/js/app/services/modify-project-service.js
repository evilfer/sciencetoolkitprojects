/*global angular*/

angular.module('nspServices').factory('ModifyProjectService', ['$http', 'UpdateNotifyService', function($http, UpdateNotifyService) {
    console.log(UpdateNotifyService);

    var service = {
      working: false
    };

    service._post = function(data) {
      this.working = true;
      var self = this;

      return $http.post('/api/projects', data).then(function(result) {
        self.working = false;
        UpdateNotifyService.somethingChanged();
        return result.data;
      });
    };

    service.submit = function(project) {
      var data = {
        'action': project.id ? 'update' : 'create',
        'project': project
      };
      return this._post(data);
    };

    service._memberAction = function(id, action) {
      var data = {
        'action': action,
        'id': id
      };
      return this._post(data);
    };

    service.joinProject = function(id) {
      this._memberAction(id, 'join');
    };
    service.leaveProject = function(id) {
      this._memberAction(id, 'leave');
    };

    return service;
  }]);
