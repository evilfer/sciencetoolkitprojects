/*global angular*/

angular.module('nspServices').factory('ModifyProjectService', ['$http', 'UpdateNotifyService', function($http, UpdateNotifyService) {
    var service = {
      working: false
    };

    service._post = function(data) {
      this.working = true;
      var self = this;

      console.log(data);
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

    service.setProfileTitle = function(projectId, profile) {
      var data = {
        'action': 'setprofiletitle',
        'id': projectId,
        'profileid': profile.id,
        'title': profile.title
      };
      return this._post(data);
    };

    service.deleteProfile = function(projectId, profileId) {
      var data = {
        'action': 'deleteprofile',
        'id': projectId,
        'profileid': profileId
      };
      return this._post(data);
    };

    service.saveInput = function(projectId, profileId, input) {
      var data = {
        'action': 'saveinput',
        'id': projectId,
        'profileid': profileId,
        'input': input
      };
      return this._post(data);
    };

    service.saveTransformations = function(projectId, profileId, inputId, transformations) {
      var data = {
        'action': 'savetransformations',
        'id': projectId,
        'profileid': profileId,
        'inputid': inputId,
        'transformations': transformations
      };
      return this._post(data);
    };

    service.deleteInput = function(projectId, profileId, inputId) {
      var data = {
        'action': 'deleteinput',
        'id': projectId,
        'profileid': profileId,
        'inputid': inputId
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


    return service;
  }]);
