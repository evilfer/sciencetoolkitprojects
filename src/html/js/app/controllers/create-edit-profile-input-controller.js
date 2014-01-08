/*global angular, Math*/

angular.module('myApp').controller('CreateEditProfileInputCtrl', function($scope, SensorsService, ModifyProjectService) {
  $scope.saveSrv = ModifyProjectService;

  $scope.isNew = $scope.input ? false : true;

  $scope.view = {
    isOpen: false,
    editingData: null,
    okButtonDisabled: function() {
      return false;
    },
    sensorName: function() {
      return SensorsService.sensorTypes[$scope.input.sensor].name;
    }
  };

  $scope.actions = {
    open: function() {
      $scope.view.editingData = $scope.isNew ? {sensor: '', rate: 10} : {
        sensor: $scope.input.sensor,
        rate: $scope.input.rate
      };
      
      $scope.view.isOpen = true;
    },
    close: function() {
      $scope.view.isOpen = false;
    },
    cancel: function() {
      this.close();
    },
    save: function() {
      var input;
      if ($scope.isNew) {
        input = {sensor: $scope.view.editingData.sensor, rate: $scope.view.editingData.rate, id: 0};
        for (var i = 0; i < $scope.profile.inputs.length; i++) {
          var eid = $scope.profile.inputs[i].id;
          if (eid >= input.id) {
            input.id = eid + 1;
          }
        }
      } else {
        $scope.input.sensor = $scope.view.editingData.sensor;
        $scope.input.rate = $scope.view.editingData.rate;
        input = $scope.input;
      }
      $scope.saveSrv.saveInput($scope.project.id, $scope.profile.id, input);
      this.close();
    }
  };
});
