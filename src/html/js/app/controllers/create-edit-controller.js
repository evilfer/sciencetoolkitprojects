/*global angular, Math*/

var myApp = angular.module('myApp');
myApp.controller('CreateEditCtrl', function($scope, $state, $stateParams, ProjectIdService, SyncService, ModifyProjectService) {
  $scope.request = ProjectIdService.check($stateParams);
  $scope.watchers = new nspWatchers();
  $scope.syncService = SyncService;
  if ($scope.request.projectId) {
    $scope.project = null;
    $scope.ready = false;
    $scope.watchers.watch($scope, 'syncService.data', function() {
      $scope.project = $scope.syncService.data.project;
      $scope.original = nspClone($scope.project);
      $scope.bad = false;
      $scope.ready = true;
    });
    $scope.syncService.getProject($scope.request.projectId, false, true);
  } else {
    $scope.project = {};
    $scope.bad = false;
    $scope.ready = true;
  }

  $scope.$on('$destroy', function() {
    $scope.syncService.stop();
    $scope.watchers.unwatch();
  });
  $scope.modifyProjectSrv = ModifyProjectService;
  $scope.awaitingDataAnswer = false;
  $scope.watchers.watch($scope, 'modifyProjectSrv.working', function() {
    $scope.awaitingDataAnswer = $scope.modifyProjectSrv.working;
  });
  $scope.actions = {
    cancel: function() {
      $state.go('create.list');
    }
  };
  $scope.okButtonDisabled = function() {
    return !$scope.ready || $scope.awaitingDataAnswer || !$scope.project || !Boolean($scope.project.title) || (!$scope.request.isNew && angular.equals($scope.project, $scope.original));
  };

  $scope.metadataEdition = {
    isOpen: false,
    open: function() {
      this.isOpen = true;
    },
    save: function() {
      this.close();
      $scope.projectActions.saveMetadata();
    },
    cancel: function() {
      if ($scope.request.isNew) {
        $state.go('create.list');
      } else {
        this.close();
      }
    },
    close: function() {
      this.isOpen = false;
    },
    okButtonDisabled: function() {
      if (!$scope.ready || $scope.awaitingDataAnswer || !$scope.project || !Boolean($scope.project.title)) {
        return true;
      } else if ($scope.request.isNew) {
        return false;
      } else {
        return angular.equals($scope.project.title, $scope.original.title) && angular.equals($scope.project.description, $scope.original.description);
      }
    }
  };

  $scope.projectActions = {
    saveMetadata: function() {
      if ($scope.$parent.ready && !$scope.awaitingDataAnswer) {
        $scope.modifyProjectSrv.submitMetadata($scope.project).then(function(data) {
          if ($scope.request.isNew) {
            $state.go('create.edit', {projectId: data.id});
          } else {
            $scope.original = nspClone($scope.project);
          }
        });
      }
    },
    setIsPublic: function(public) {
      if (!$scope.request.isNew) {
        $scope.modifyProjectSrv.setIsPublic($scope.project.id, public).then(function(data) {
          if (data.ok) {
            $scope.project.is_public = data.is_public;
          }
        });
      }
    }
  };
  $scope.profileActions = {
    isOpen: false,
    openId: null,
    openProfile: null,
    open: function(profileId) {
      if (profileId === null || typeof profileId === 'undefined') {
        this.openId = null;
        this.openProfile = {id: this._getNextProfileId(), inputs: []};
      } else {
        this.openId = profileId;
        this.openProfile = nspClone(this._getProfile(profileId));
      }
      this.isOpen = true;
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
      this.isOpen = false;
      this.openProfile = null;
    },
    isNewProfile: function() {
      return this.openId === null;
    },
    isEditingNew: function() {
      return this.isOpen && this.isNewProfile();
    },
    isEditingProfile: function(profileId) {
      return this.isOpen && this.openId === profileId;
    },
    /*deleteProfile: function(profileId) {
     this._deleteChild($scope.project.profiles, profileId);
     },*/
    addProfileInput: function() {
      this._createChild(this.openProfile, 'inputs');
    },
    deleteProfileInput: function(sensorId) {
      this._deleteChild(this.openProfile.inputs, sensorId);
    },
    _createChild: function(containerParent, containerName) {
      if (typeof containerParent[containerName] !== 'object') {
        containerParent[containerName] = [];
      }
      var id = this._getNextId(containerParent, containerName);

      containerParent[containerName].push({id: id});
    },
    _getNextId: function(containerParent, containerName) {
      var id = 0;
      for (var i = 0; i < containerParent[containerName].length; i++) {
        id = Math.max(containerParent[containerName][i].id, i + 1);
      }
      return id;
    },
    _getNextProfileId: function() {
      return this._getNextId($scope.project, 'profiles');
    },
    _deleteChild: function(container, id) {
      var index = this._getIndex(container, id);
      if (index !== false) {
        container.splice(index, 1);
      }
    },
    _getIndex: function(container, id) {
      for (var i = container.length - 1; i >= 0; i--) {
        if (container[i].id === id) {
          return i;
        }
      }
      return false;
    },
    _getProfile: function(id) {
      var index = this._getIndex($scope.project.profiles, id);
      return index !== false ? $scope.project.profiles[index] : null;
    }
  };
});
