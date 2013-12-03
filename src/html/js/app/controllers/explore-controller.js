/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ExploreCtrl', function($scope, ProjectList, ProjectCreate) {
  $scope.listsrv = ProjectList.getList();
  $scope.createsrv = ProjectCreate.create($scope.listsrv);

  $scope.projects = {};
  $scope.working = false;

  $scope.toDestroy = [{
      obj: $scope.listsrv,
      unwatch: $scope.$watch('listsrv.projects', function() {
        $scope.projects = $scope.listsrv.projects;
      })
    }, {
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

  $scope.joinActions = {
    join: function(projectId) {
      $scope.createsrv.joinProject(projectId);
    },
    leave: function(projectId) {
      $scope.createsrv.leaveProject(projectId);
    }
  };

});

test = function() {
  console.log('bla');
};
