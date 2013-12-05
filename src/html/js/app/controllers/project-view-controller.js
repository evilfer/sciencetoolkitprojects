/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ProjectViewCtrl', function($scope, SyncService, ProjectIdService, $stateParams) {
  $scope.request = ProjectIdService.check($stateParams);

  $scope.watchers = new nspWatchers();

  $scope.syncService = SyncService;

  if ($scope.request.projectId) {
    $scope.project = null;
    $scope.ready = false;

    $scope.watchers.watch($scope, 'syncService.data', function() {
      $scope.project = $scope.syncService.data.project;
      $scope.bad = false;
      $scope.ready = true;
    });

    $scope.syncService.getProject($scope.request.projectId, true);
  } else {
    $scope.project = {};
    $scope.bad = true;
    $scope.ready = true;
  }
  
  $scope.$on('$destroy', function() {
    $scope.syncService.stop();
    $scope.watchers.unwatch();
  });

});

