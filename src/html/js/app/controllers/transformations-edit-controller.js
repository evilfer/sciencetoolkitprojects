/*global angular, Math*/

angular.module('myApp').controller('TransformationsEditCtrl', function($scope, SensorsService, ModifyProjectService) {

  $scope.saveSrv = ModifyProjectService;

  $scope.ops = {
    setTypes: function(vts, vt) {
      var st = vts[vt.sourceid];
      if (!st.output) {
        this.setTypes(vts, st);
      }

      if (!vt.input) {
        vt.input = st.output;
        vt.output = SensorsService.transformations[vt.transformation].data[vt.input];
        vt.availableTransformations = $scope.ops.availableTransformations(vt.output);
      }
    },
    getViewTransformations: function(transformations) {
      var ts = {};
      var rawOutput = SensorsService.sensorTypes[$scope.input.sensor].output;
      ts[0] = {
        id: 0,
        editable: false,
        sourceid: false,
        input: false,
        transformation: false,
        output: rawOutput,
        name: 'Raw data',
        availableTransformations: $scope.ops.availableTransformations(rawOutput)
      };

      if (transformations) {
        for (var i = 0; i < transformations.length; i++) {
          var rt = transformations[i];
          ts[rt.id] = {
            id: rt.id,
            editable: true,
            sourceid: rt.sourceid,
            transformation: rt.transformation,
            name: rt.display_name,
            input: false,
            output: false,
            availableTransformations: false
          };
        }

        for (var id in ts) {
          if (id > 0) {
            this.setTypes(ts, ts[id]);
          }
        }
      }

      return ts;
    },
    availableTransformations: function(dataType) {
      var at = [];
      for (var key in SensorsService.transformations) {
        if (dataType in SensorsService.transformations[key].data) {
          at.push(key);
        }
      }

      return at;
    }
  };

  $scope.view = {
    isOpen: false,
    okButtonDisabled: function() {
      return false;
    },
    viewTransformations: $scope.ops.getViewTransformations($scope.input.transformations),
    reset: function() {
      this.viewTransformations = $scope.ops.getViewTransformations($scope.input.transformations);
    },
    canEdit: function(t) {
      return this.isOpen && t.editable;
    },
    canTransform: function(t) {
      return this.isOpen && t.availableTransformations && t.availableTransformations.length > 0;
    },
    atname: function(at) {
      return SensorsService.transformations[at].name;
    },
    tname: function(t) {
      return SensorsService.transformations[t.transformation].name;
    },
    iname: function(t) {
      return $scope.view.viewTransformations[t.sourceid].name;
    },
    dname: function(t) {
      return SensorsService.dataTypes[t.output];
    },
    oname: function(t) {
      return t.name;
    },
    ostyle: function(t) {      
      return {fontFamily: 'monospace', fontWeight: 'bold', color: nspColorGenerator.getColor(t.id, 1, .4)};
    },
    istyle: function(t) {      
      return {fontWeight: 'bold', 'color': nspColorGenerator.getColor(t.sourceid, 1, .4)};
    }

  };


  $scope.view.reset();


  $scope.actions = {
    open: function() {
      $scope.view.isOpen = true;
    },
    close: function() {
      $scope.view.isOpen = false;
    },
    cancel: function() {
      $scope.view.reset();
      this.close();
    },
    save: function() {
      var ts = [];
      for (var i in $scope.view.viewTransformations) {
        if (i > 0) {
          var vt = $scope.view.viewTransformations[i];
          ts.push({
            id: vt.id,
            sourceid: vt.sourceid,
            transformation: vt.transformation,
            display_name: vt.name
          });
        }
      }
      $scope.saveSrv.saveTransformations($scope.project.id, $scope.profile.id, $scope.input.id, ts);
      this.close();
    },
    transform: function(source, transformation) {
      var ntInputType = source.output;
      var ntOutputType = SensorsService.transformations[transformation].data[ntInputType];

      var id = 1;
      for (var key in $scope.view.viewTransformations) {
        var tid = $scope.view.viewTransformations[key].id;
        if (tid >= id) {
          id = tid + 1;
        }
      }

      var nt = {
        id: id,
        editable: true,
        sourceid: source.id,
        transformation: transformation,
        name: '',
        input: ntInputType,
        output: ntOutputType,
        availableTransformations: $scope.ops.availableTransformations(ntOutputType)
      };

      $scope.view.viewTransformations[id] = nt;
    },
    deleteTransformation: function(t) {
      while (true) {
        var dependent = false;
        for (var i in $scope.view.viewTransformations) {
          if ($scope.view.viewTransformations[i].sourceid === t.id) {
            dependent = $scope.view.viewTransformations[i];
            break;
          }
        }

        if (dependent) {
          this.deleteTransformation(dependent);
        } else {
          break;
        }
      }

      delete $scope.view.viewTransformations[t.id];
    }

  };

});

