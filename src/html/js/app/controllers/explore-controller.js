/*global angular*/


var myApp = angular.module('myApp');

myApp.controller('ExploreCtrl', function($scope, ProjectList, ProjectCreate) {
    $scope.listsrv = ProjectList.getList();
    $scope.projects = {};

    $scope.watches = [
        $scope.$watch('listsrv.projects', function() {
            $scope.projects = $scope.listsrv.projects;
        })
    ];

    $scope.$on('$destroy', function() {
        $scope.listsrv.destroy();
        for (var i = 0; i < $scope.watches.length; i++) {
            $scope.watches[i]();
        }
    });
});
