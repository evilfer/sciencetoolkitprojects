angular.module('myApp').directive('nqFlotChart', ['SensorsService', function(SensorsService) {
    return {
      scope: {
        'chart': '=',
        'data': '='
      },
      
      link: function(scope, element, attrs) {
        var $element = angular.element(element);
        var renderer = new nspChartRenderer($element, scope.chart, scope.data);
        renderer.update();
      }
    };
  }
]);
