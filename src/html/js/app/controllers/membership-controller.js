
/*global angular, updateURLParameter*/

var myApp = angular.module('myApp');

myApp.controller('MembershipCtrl', function($scope, $state, LoginService, ModifyProjectService) {
  $scope.watchers = new nspWatchers();

  $scope.loginSrv = LoginService;
  var updateLogin = function() {
    $scope.loginStatus = $scope.loginSrv.status;
  };
  updateLogin();
  $scope.watchers.watch($scope, 'loginSrv.ready', updateLogin);

  $scope.modifyProjectSrv = ModifyProjectService;



  $scope.joinActions = {
    join: function(projectId) {
      $scope.modifyProjectSrv.joinProject(projectId);
    },
    leave: function(projectId) {
      $scope.modifyProjectSrv.leaveProject(projectId);
    },
    edit: function(projectId) {
      $state.go('create.edit', {projectId: projectId});
    }
  };

  $scope.$on('$destroy', function() {
    $scope.watchers.unwatch();
  });

});

