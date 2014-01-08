/*global angular, Math*/

angular.module('myApp').controller('TransformationsEditCtrl', function($scope, SensorsService) {
  
  $scope.editingTransformations = $scope.profileActions.isOpen();
  console.log("editable: " + $scope.editingTransformations);
  
  $scope.transformationActions = {
    availableTransformations: function(dataType) {
      var at = [];
      for (var key in SensorsService.transformations) {
        if (dataType in SensorsService.transformations[key].data) {
          at.push(key);
        }
      }

      return at;
    },
    transform: function(input, transformation) {
      var ntInputType = input.output;
      var ntOutputType = SensorsService.transformations[transformation].data[ntInputType];

      var id = 1;
      for (var i in $scope.transformations) {
        if (i >= id) {
          id = i + 1;
        }
      }

      var nt = {
        id: id,
        editable: true,
        input: input.id,
        transformation: transformation,
        output: ntOutputType,
        name: '',
        availableTransformations: $scope.transformationActions.availableTransformations(ntOutputType)
      };

      $scope.transformations[id] = nt;
    }
  };

  $scope.transformations = {};

  var rawOutput = SensorsService.sensorTypes[$scope.input.sensor].output;
  $scope.transformations[0] = {
    id: 0,
    editable: false,
    input: false,
    transformation: false,
    output: rawOutput,
    name: 'Raw data',
    availableTransformations: $scope.transformationActions.availableTransformations(rawOutput)
  };

  $scope.view = {
    atname: function(at) {
      return SensorsService.transformations[at].name;
    },
    tname: function(t) {
      return SensorsService.transformations[t.transformation].name;
    },
    iname: function(t) {
      return $scope.transformations[t.input].name;
    },
    dname: function(t) {
      return SensorsService.dataTypes[t.output];
    },
    oname: function(t) {
      return t.name;
    }
  };

});
