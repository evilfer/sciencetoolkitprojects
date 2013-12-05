/*global angular, updateURLParameter*/

var myApp = angular.module('myApp');

myApp.controller('LoginCtrl', function($scope, LoginService, $location) {
  $scope.watchers = new nspWatchers();

  $scope.location = $location;

  $scope.loginSrv = LoginService;

  var update = function() {
    $scope.ready = $scope.loginSrv.ready;
    $scope.status = $scope.loginSrv.status;
  };

  update();
  $scope.watchers.watch($scope, 'loginSrv.ready', update);

  $scope.$on('$destroy', function() {
    $scope.watchers.unwatch();
  });

});