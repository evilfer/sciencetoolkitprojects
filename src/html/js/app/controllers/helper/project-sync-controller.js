/*global angular, Math*/

var myApp = angular.module('myApp');

myApp.controller('ProjectSyncCtrl', function($scope, $stateParams, ProjectGetSync) {
  $scope.isNew = typeof $stateParams.projectId === 'undefined' || !$stateParams.projectId;
  $scope.projectId = $scope.isNew ? false : parseInt($stateParams.projectId);
  $scope.bad = false;

  if ($scope.isNew) {
    $scope.project = {
      profiles: []
    };
    $scope.ready = true;
  } else {
    $scope.ready = false;
    $scope.projectsrv = ProjectGetSync.get($scope.projectId);
    $scope.projectUpdateListener = $scope.projectsrv;
    
    $scope.unwatch = $scope.$watch('projectsrv.data', function() {
      $scope.ready = true;
      $scope.bad = !$scope.projectsrv.data.ok;
      $scope.project = $scope.projectsrv.data.project;
    });
  }
});


