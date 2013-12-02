/*global angular*/


var myApp = angular.module('myApp');

myApp.controller('NavigationCtrl', function($scope, $location) {

    $scope.location = $location;

    $scope.notAtHome = function() {
        return $scope.section !== "home";
    };

    $scope.inactiveSection = function(section) {
        return $scope.notAtHome() && section !== $scope.section;
    };

    $scope.$watch('location.path()', function () {
        var path = $scope.location.path().split('/');
        $scope.section = path.length >= 2 ? path[1] : "";
    });
});

