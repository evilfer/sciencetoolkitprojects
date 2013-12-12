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
});
