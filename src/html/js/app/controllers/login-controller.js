/*global angular, updateURLParameter*/

var myApp = angular.module('myApp');

myApp.controller('LoginCtrl', function($scope, LoginStatus, $location) {

    $scope.location = $location;

    var statusAnswer = LoginStatus.getStatus();
    if (statusAnswer.then) {
        statusAnswer.then(function(data) {
            $scope.status = data;
            $scope.link = $scope.status.link;
            // updateURLParameter($scope.status.link, "continue", $scope.destination);
        });
    } else {
        $scope.status = statusAnswer;
        $scope.link = $scope.status.link;
        // updateURLParameter($scope.status.link, "continue", $scope.destination);
    }

});