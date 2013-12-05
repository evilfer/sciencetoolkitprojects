/*global angular, Math*/

var myApp = angular.module('myApp');

myApp.controller('CreateListCtrl', function($scope, $state, SyncService) {
  $scope.watchers = new nspWatchers();

  $scope.projects = {};

  $scope.syncService = SyncService;

  $scope.watchers.watch($scope, 'syncService.data', function() {
    $scope.projects = $scope.syncService.data.projects;
  });


  $scope.actions = {
    newProject: function() {
      $state.go('create.new');
    },
    openProject: function(projectId) {
      $state.go('create.edit', {projectId: projectId});
    }
  };

  $scope.$on('$destroy', function() {
    $scope.syncService.stop();
    $scope.watchers.unwatch();
  });

  $scope.syncService.getList('owned');

});
