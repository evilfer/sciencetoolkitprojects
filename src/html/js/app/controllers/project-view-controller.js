/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('ProjectViewCtrl', function($scope, $stateParams, ProjectIdService, SyncService, SubscriptionService, SensorsService, TransformationSelectorService) {
  $scope.request = ProjectIdService.check($stateParams);

  $scope.watchers = new nspWatchers();

  $scope.syncService = SyncService;
  

  if ($scope.request.projectId) {
    $scope.project = null;
    $scope.ready = false;

    $scope.watchers.watch($scope, 'syncService.data', function() {
      $scope.project = $scope.syncService.data.project;
      $scope.profileCharts = {};
      $scope.profileMaps = {};
      
      if ($scope.project) {
        TransformationSelectorService.init($scope.project);
        $scope.transformationSelector = TransformationSelectorService.selection[$scope.project.id];
        
        var rawSeries = nspZlib.decompressObj($scope.project.data);
        $scope.project.series = nspMaths.transformSeries(rawSeries, $scope.project.profiles);
        delete $scope.project['data'];
        
        for (var profile_id in $scope.project.series) {
          if ($scope.project.series[profile_id].length > 0) {
            var profile = $scope.project.profiles[profile_id];
            
            if (profile.requires_location) {
              $scope.profileMaps[profile_id] = {};
            }
            
            $scope.profileCharts[profile_id] = {};
            
            
            for (var input_id in $scope.project.series[profile_id][0].data) {
              var transformations = profile.inputs[input_id].transformations;
            
              for (var variable_id in $scope.project.series[profile_id][0].data[input_id]) {
                var title, type, units;
                if (variable_id in transformations) {
                  var t = transformations[variable_id];
                  title = t.display_name;
                  var sourceChart = $scope.profileCharts[profile_id][input_id + "." + t.sourceid];
                  type = SensorsService.transformType(sourceChart.type, t.transformation);
                  units = SensorsService.transformUnits(sourceChart.units, t.transformation);
                } else {
                  var sensor = profile.inputs[input_id].sensor;
                  title = 'Raw data';
                  units = SensorsService.sensorTypes[sensor].units;
                  type = SensorsService.sensorTypes[sensor].output;
                }
                
                if (type === 'x' || type === 'tx') {
                  $scope.profileMaps[profile_id][variable_id] = title;
                }
                
                $scope.profileCharts[profile_id][input_id + "." + variable_id] = {
                  profile: profile_id,
                  input: input_id,
                  variable: variable_id,
                  title: title,
                  type: type,
                  units: units,
                  unitLabel: SensorsService.unitsToStr(units)
                };
              }
            }
          }
        }
        
        console.log($scope.profileMaps);
      }

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
        count += series.data[key][0].length;
      }
      return count;
    },
    length: function(series) {
      var length = 0;
      for (var key in series.data) {
        var d = series.data[key][0];
        if (d.length > 1) {
          length = Math.max(length, d[d.length - 1][0] - d[0][0]);
        }
      }

      return .001 * length;
    },
    location: function(series) {
      return series.metadata.location.lat + " " + series.metadata.location.lon;
    }
  };

  $scope.sensorName = function(sensorType) {
    return SensorsService.sensorTypes[sensorType].name;
  };

  $scope.view = {
    tab: 'map',
    openTab: function(tab) {
      this.tab = tab;
    }
  };
  
  $scope.transformationSelector = {};
  
});

