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

    $scope.syncService.getProject($scope.request.projectId, false);
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

  $scope.projectActions = {
    save: function() {
      if ($scope.$parent.ready && !$scope.awaitingDataAnswer) {
        $scope.modifyProjectSrv.submit($scope.project).then(function(data) {
          console.log('save answer');
          console.log(data);
          if ($scope.request.isNew) {
            $state.go('create.edit', {projectId: data.id});
          } else {
            $scope.original = nspClone($scope.project);
          }
        });
      }
    },
    addProfile: function() {
      this._createChild($scope.$parent.project, 'profiles');
    },
    deleteProfile: function(profileId) {
      this._deleteChild($scope.$parent.project.profiles, profileId);
    },
    addProfileInput: function(profileId) {
      var profile = this._getProfile(profileId);
      this._createChild(profile, 'inputs');
    },
    deleteProfileInput: function(profileId, sensorId) {
      var profile = this._getProfile(profileId);
      this._deleteChild(profile.inputs, sensorId);
    },
    _createChild: function(containerParent, containerName) {
      if (typeof containerParent[containerName] !== 'object') {
        containerParent[containerName] = [];
      }
      var id = 0;
      for (var i = 0; i < containerParent[containerName].length; i++) {
        id = Math.max(containerParent[containerName][i].id, i + 1);
      }

      containerParent[containerName].push({id: id});
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
      var index = this._getIndex($scope.$parent.project.profiles, id);
      return index !== false ? $scope.$parent.project.profiles[index] : null;
    }
  };

});
