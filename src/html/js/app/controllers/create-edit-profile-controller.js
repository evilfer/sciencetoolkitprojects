/*global angular, Math*/

var myApp = angular.module('myApp');
myApp.controller('CreateEditProfileCtrl', function($scope, SensorsService) {

  $scope.sensorData = SensorsService;

  $scope.profileActions = {
    _isOpen: false,
    _openId: null,
    openProfile: null,
    open: function(profileId) {
      if (profileId === null || typeof profileId === 'undefined') {
        this._openId = null;
        this.openProfile = {id: this._getNextProfileId(), inputs: []};
      } else {
        this._openId = profileId;
        this.openProfile = nspClone(this._getProfile(profileId));
      }
      this._isOpen = true;
    },
    cancel: function() {
      this.close();
    },
    save: function() {
      $scope.modifyProjectSrv.submitProfile($scope.project.id, this.openProfile);
      this.close();
    },
    makeActive: function(profileId, active) {
      $scope.modifyProjectSrv.setProfileIsActive($scope.project.id, profileId, active);
    },
    close: function() {
      this._isOpen = false;
      this.openProfile = null;
    },
    isOpen: function() {
      return this._isOpen;
    },
    isNewProfile: function() {
      return this._openId === null;
    },
    isEditingNew: function() {
      return this._isOpen && this.isNewProfile();
    },
    isEditingProfile: function(profileId) {
      return this._isOpen && this._openId === profileId;
    },
    addProfileInput: function() {
      nspChildrenManager.createChild(this.openProfile, 'inputs');
    },
    deleteProfileInput: function(sensorId) {
      nspChildrenManager.deleteChild(this.openProfile.inputs, sensorId);
    },
    _getNextProfileId: function() {
      return nspChildrenManager.getNextId($scope.project, 'profiles');
    },
    _getProfile: function(id) {
      var index = nspChildrenManager.getIndex($scope.project.profiles, id);
      return index !== false ? $scope.project.profiles[index] : null;
    }
  };
});
