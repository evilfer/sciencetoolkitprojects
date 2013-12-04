/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ExploreCtrl', function($scope, ProjectList, $state) {
  $scope.listsrv = ProjectList.getList();
  $scope.projectUpdateListener = $scope.listsrv;

  $scope.projects = {};

  $scope.toDestroy = [{
      obj: $scope.listsrv,
      unwatch: $scope.$watch('listsrv.projects', function() {
        $scope.projects = $scope.listsrv.projects;
      })
    }];

  $scope.$on('$destroy', function() {
    for (var i = 0; i < $scope.toDestroy.length; i++) {
      var toDestroy = $scope.toDestroy[i];
      toDestroy.obj.destroy();
      toDestroy.unwatch();
    }
  });

  $scope.exploreActions = {
    open: function(projectId) {
      $state.go('explore-project', {projectId: projectId});
    }
  };

});

