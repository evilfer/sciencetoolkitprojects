/*global console, angular*/

var myApp = angular.module('myApp', ['nspServices', /* 'directive.g+signin',*/ 'ui.router']);


myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/', '/home').when('', '/home');
    $urlRouterProvider.when('/create', '/create/all');

    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'partials/home.html'
    });

    $stateProvider
            .state('start', {
              url: '/start',
              templateUrl: 'partials/start.html'
            })
            .state('explore', {
              url: '/explore',
              templateUrl: 'partials/explore.html',
              controller: 'ExploreListCtrl'
            })
            .state('explore-project', {
              url: '/explore/{projectId}',
              templateUrl: 'partials/view_project.html',
              controller: 'ProjectViewCtrl'
            })
            .state('create', {
              url: '/create',
              templateUrl: 'partials/create.html',
              abstract: true
            })
            .state('create.list', {
              url: '/all',
              templateUrl: 'partials/create_list.html',
              controller: 'CreateListCtrl'
            })
            .state('create.new', {
              url: '/new',
              templateUrl: 'partials/create_new.html',
              controller: 'CreateEditCtrl'
            })
            .state('create.edit', {
              url: '/edit/{projectId}',
              templateUrl: 'partials/create_edit.html',
              controller: 'CreateEditCtrl'
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
