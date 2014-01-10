angular.module('myApp').directive('nqDataTransformations', ['SensorsService', function(SensorsService) {
    return {
      scope: {
        ngModel: '='
      },
      link: function(scope, element, attrs) {
        var $element = angular.element(element);

        var renderer = new nspTransformationsRenderer($element, scope.ngModel, SensorsService);
        renderer.update();
      }
    };
  }
]);


