
/*global angular, updateURLParameter*/

var myApp = angular.module('myApp');

myApp.controller('MembershipCtrl', function($scope, LoginStatus, ProjectCreate) {

  var statusAnswer = LoginStatus.getStatus();
  if (statusAnswer.then) {
    statusAnswer.then(function(data) {
      $scope.loginStatus = data;
    });
  } else {
    $scope.loginStatus = statusAnswer;
  }

  $scope.joinActions = {
    join: function(projectId) {
      $scope.createsrv.joinProject(projectId);
    },
    leave: function(projectId) {
      $scope.createsrv.leaveProject(projectId);
    }
  };

});

