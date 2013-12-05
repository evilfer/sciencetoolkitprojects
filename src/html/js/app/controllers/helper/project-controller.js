/*global angular, Math*/

var myApp = angular.module('myApp');

myApp.controller('ProjectCtrl', function($scope, $stateParams, ProjectGet) {
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
    ProjectGet.getProject($scope.projectId).then(function(data) {
      $scope.ready = true;
      if (data.ok) {
        $scope.project = data.project;
      } else {
        $scope.bad = true;
      }
    });
  }
});


