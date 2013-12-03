/*global angular, updateURLParameter*/

var myApp = angular.module('myApp');

myApp.controller('LoginCtrl', function($scope, LoginStatus, $location) {

    $scope.location = $location;

    $scope.$watch('location.path()', function() {
        $scope.destination = "/#" + $scope.location.path();
        if ($scope.status) {
            $scope.link = updateURLParameter($scope.status.link, "continue",
                    $scope.destination);
        }
    });

    var statusAnswer = LoginStatus.getStatus();
    if (statusAnswer.then) {
        statusAnswer.then(function(data) {
            $scope.status = data;
            $scope.link = updateURLParameter($scope.status.link, "continue",
                    $scope.destination);
        });
    } else {
        $scope.status = statusAnswer;
        $scope.link = updateURLParameter($scope.status.link, "continue",
                $scope.destination);
    }

});