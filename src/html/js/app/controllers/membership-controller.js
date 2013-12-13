
/*global angular, updateURLParameter*/

var myApp = angular.module('myApp');

myApp.controller('MembershipCtrl', function($scope, $state, LoginService, SubscriptionService) {
  $scope.watchers = new nspWatchers();

  $scope.loginSrv = LoginService;
  var updateLogin = function() {
    $scope.loginStatus = $scope.loginSrv.status;
  };
  updateLogin();
  $scope.watchers.watch($scope, 'loginSrv.ready', updateLogin);

  $scope.subscriptionSrv = SubscriptionService;

  
  var membershipCallback = function(result) {
    if (result.ok) {
      $scope.project.im_member = result.im_member;
    }
  };

  $scope.joinActions = {
    join: function(projectId) {
      $scope.subscriptionSrv.joinProject(projectId).then(membershipCallback);
    },
    leave: function(projectId) {
      $scope.subscriptionSrv.leaveProject(projectId).then(membershipCallback);
    }
  };

  $scope.$on('$destroy', function() {
    $scope.watchers.unwatch();
  });

});

