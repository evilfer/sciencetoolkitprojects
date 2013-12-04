/*global angular, Math*/

var myApp = angular.module('myApp');

myApp.controller('CreateListCtrl', function($scope, $state, ProjectList) {
  $scope.actions = {
    newProject: function() {
      $state.go('create.new');
    },
    openProject: function(projectId) {
      $state.go('create.edit',  {projectId: projectId});
    }
  };

  $scope.listsrv = ProjectList.getList('owned');
  $scope.projects = {};

  $scope.unwatch = $scope.$watch('listsrv.projects', function() {
    $scope.projects = $scope.listsrv.projects;
  });

  $scope.$on('$destroy', function() {
    $scope.unwatch();
    $scope.listsrv.destroy();
  });
});
