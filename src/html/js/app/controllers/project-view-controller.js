/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ProjectViewCtrl', function($scope, $stateParams, ProjectIdService, SyncService, SubscriptionService, SensorsService) {
  $scope.request = ProjectIdService.check($stateParams);

  $scope.watchers = new nspWatchers();

  $scope.syncService = SyncService;



  if ($scope.request.projectId) {
    $scope.project = null;
    $scope.ready = false;

    $scope.watchers.watch($scope, 'syncService.data', function() {
      $scope.project = $scope.syncService.data.project;
      $scope.profileCharts = {};
      if ($scope.project) {
        for (var profile_id in $scope.project.series) {
          if ($scope.project.series[profile_id].length > 0) {
            $scope.profileCharts[profile_id] = {};
            for (var input_id in $scope.project.series[profile_id][0].data) {
              for (var variable_id in $scope.project.series[profile_id][0].data[input_id]) {
                $scope.profileCharts[profile_id][input_id + "." + variable_id] = {
                  profile: profile_id,
                  input: input_id,
                  variable: variable_id
                };
              }
            }
          }
        }
      }

      console.log($scope.profileCharts);
      $scope.bad = false;
      $scope.ready = true;
    });

    $scope.syncService.getProject($scope.request.projectId, true, false, false);
  } else {
    $scope.project = {};
    $scope.charts = {};
    $scope.bad = true;
    $scope.ready = true;
  }

  $scope.$on('$destroy', function() {
    $scope.syncService.stop();
    $scope.watchers.unwatch();
  });

  var changeProfileCallback = function(result) {
    console.log(result);
    if (result.ok) {
      $scope.project.profiles[result.profileid].installed = result.installed;
    }
  };

  $scope.subscriptionSrv = SubscriptionService;
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
    },
    length: function(series) {
      var length = 0;
      for (var key in series.data) {
        var d = series.data[key];
        if (d.length > 1) {
          length = Math.max(length, d[d.length - 1][0] - d[0][0]);
        }
      }

      return .001 * length;
    }
  };

  $scope.sensorName = function(sensorType) {
    return SensorsService.sensorTypes[sensorType].name;
  };

  $scope.view = {
    tab: 'series',
    openTab: function(tab) {
      this.tab = tab;
    }
  };

});

