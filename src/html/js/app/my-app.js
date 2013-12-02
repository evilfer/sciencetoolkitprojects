/*global console, angular*/

var myApp = angular.module('myApp', ['loginServices', 'projectServices', /*'directive.g+signin', */'ngRoute']);


myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/home', {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeCtrl'
                }).
                when('/start', {
                    templateUrl: 'partials/start.html',
                    controller: 'HomeCtrl'
                }).
                when('/explore', {
                    templateUrl: 'partials/explore.html',
                    controller: 'ExploreCtrl'
                }).
                when('/create', {
                    templateUrl: 'partials/create.html',
                    controller: 'CreateCtrl'
                }).
                otherwise({
                    redirectTo: '/home'
                });
    }]);



function signinCallback(authResult) {

    console.log(authResult);
    if (authResult.access_token) {
        // User successfully authorized the G+ App!

    } else if (authResult.error) {
        // User has not authorized the G+ App!
    }
}
