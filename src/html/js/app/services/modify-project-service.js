/*global angular*/

angular.module('nspServices').factory('ModifyProjectService', ['$http', 'UpdateNotifyService', function($http, UpdateNotifyService) {
    var service = {
      working: false
    };

    service._post = function(data) {
      this.working = true;
      var self = this;

      return $http.post('/api/projects', data).then(function(result) {
        console.log(result.data);
        self.working = false;
        UpdateNotifyService.somethingChanged();
        return result.data;
      });
    };

    service.submitMetadata = function(project) {
      var data = {
        'action': project.id ? 'update' : 'create',
        'id': project.id ? project.id : false,
        'metadata': {title: project.title, description: project.description}
      };
      return this._post(data);
    };

    service.submitProfile = function(projectId, profile) {
      var data = {
        'action': 'submitprofile',
        'id': projectId,
        'profile': profile
      };
      return this._post(data);
    };

    service.setProfileIsActive = function(projectId, profileId, active) {
      var data = {
        'action': 'changeprofilevisibility',
        'id': projectId,
        'profile_id': profileId,
        'is_active': active
      };
      return this._post(data);
    };

    service.setIsPublic = function(projectId, public) {
      var data = {
        'action': 'changevisibility',
        'id': projectId,
        'is_public': public
      };
      console.log('posting...');
      console.log(data);
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
