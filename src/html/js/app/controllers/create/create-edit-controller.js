/*global angular, Math*/

var myApp = angular.module('myApp');

myApp.controller('CreateEditCtrl', function($scope, $state, ProjectCreate) {
  $scope.awaitingDataAnswer = false;
  
  $scope.createsrv = ProjectCreate.create();

  $scope.watches = [
    $scope.$watch('createsrv.working', function() {
      $scope.awaitingDataAnswer = $scope.createsrv.working;
    })
  ];

  $scope.actions = {
    cancel: function() {
      $state.go('create.list');
    }
  };

  $scope.okButtonDisabled = function() {
    return !$scope.ready || $scope.awaitingDataAnswer || !Boolean($scope.$parent.project.title);
  };

  $scope.projectActions = {
    save: function() {
      if ($scope.$parent.ready && !$scope.awaitingDataAnswer) {
        $scope.createsrv.submit($scope.$parent.project).then(function(data) {
          if ($scope.$parent.isNew) {
            $state.go('create.edit', {projectId: data.id});
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

  $scope.$on('$destroy', function() {
    for (var i = 0; i < $scope.watches.length; i++) {
      $scope.watches[i]();
    }

    $scope.createsrv.destroy();
  });
});
