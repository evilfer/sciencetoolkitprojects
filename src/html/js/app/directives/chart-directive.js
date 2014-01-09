angular.module('myApp').directive('nqFlotChart', ['SensorsService', function(SensorsService) {
    return {
      scope: {
        'chart': '=',
        'project': '='
      },
      
      link: function(scope, element, attrs) {
        var $element = angular.element(element);
        var dataList = scope.project.series[scope.chart.profile];
        var inputs = scope.project.profiles[scope.chart.profile].inputs;
        var renderer = new nspChartRenderer($element, scope.chart, dataList, inputs, SensorsService);
        renderer.update();
      }
    };
  }
]);
