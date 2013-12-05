/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ExploreListCtrl', function($scope, SyncService, $state) {
  $scope.watchers = new nspWatchers();

  $scope.projects = {};

  $scope.syncService = SyncService;

  $scope.watchers.watch($scope, 'syncService.data', function() {
  $scope.projects = $scope.syncService.data.projects;
  });

  $scope.exploreActions = {
    open: function(projectId) {
      $state.go('explore-project', {projectId: projectId});
    }
  };

  $scope.$on('$destroy', function() {
    $scope.syncService.stop();
    $scope.watchers.unwatch();
  });

  $scope.syncService.getList();
  
});

