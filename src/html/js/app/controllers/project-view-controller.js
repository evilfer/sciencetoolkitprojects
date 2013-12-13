/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ProjectViewCtrl', function($scope, $stateParams, ProjectIdService, SyncService, SubscriptionService) {
  $scope.request = ProjectIdService.check($stateParams);

  $scope.watchers = new nspWatchers();

  $scope.syncService = SyncService;
  
  $scope.subscriptionSrv = SubscriptionService;
  
  if ($scope.request.projectId) {
    $scope.project = null;
    $scope.ready = false;

    $scope.watchers.watch($scope, 'syncService.data', function() {
      $scope.project = $scope.syncService.data.project;
      $scope.bad = false;
      $scope.ready = true;
    });

    $scope.syncService.getProject($scope.request.projectId, true, false, false);
  } else {
    $scope.project = {};
    $scope.bad = true;
    $scope.ready = true;
  }
  
  $scope.$on('$destroy', function() {
    $scope.syncService.stop();
    $scope.watchers.unwatch();
  });
  
  var changeProfileCallback = function(result) {
    if (result.ok) {
      $scope.project.profiles[result.profileid].installed = result.installed;
    }
  };
  
  $scope.profileActions = {
    addProfile: function(profileId) {
      $scope.subscriptionSrv.addProfile($scope.project.id, profileId).then(changeProfileCallback);
    },
    removeProfile: function(profileId) {
      $scope.subscriptionSrv.removeProfile($scope.project.id, profileId).then(changeProfileCallback);
    }
  };
  
  $scope.seriesData = {
    count: function(series) {
      var count = 0;
      for (var key in series.data) {
        count += series.data[key].length;
      }
      return count;
    }
  };
  
  $scope.charts = [
    {
      title: '1',
      series: 'all'
    }
  ];

});

