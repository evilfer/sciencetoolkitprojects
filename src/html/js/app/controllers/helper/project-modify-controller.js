/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ProjectModifyCtrl', function($scope, ProjectCreate) {

  $scope.createsrv = ProjectCreate.create($scope.projectUpdateListener);
  $scope.working = false;

  $scope.toDestroy = [{
      obj: $scope.createsrv,
      unwatch: $scope.$watch('createsrv.working', function() {
        $scope.working = $scope.createsrv.working;
      })
    }];

  $scope.$on('$destroy', function() {
    for (var i = 0; i < $scope.toDestroy.length; i++) {
      var toDestroy = $scope.toDestroy[i];
      toDestroy.obj.destroy();
      toDestroy.unwatch();
    }
  });

});

