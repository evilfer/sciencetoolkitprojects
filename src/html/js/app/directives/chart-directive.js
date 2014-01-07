angular.module('myApp').directive('nqFlotChart', ['SensorsService', function(SensorsService) {
    return {
      scope: {
        'chart': '=',
        'project': '=',
        'profile': '='
      },
      
      link: function(scope, element, attrs) {
        var $element = angular.element(element);
        var dataList = scope.project.series[scope.profile];
        var inputs = scope.project.profiles[scope.profile].inputs;
        var renderer = new nspChartRenderer($element, scope.chart, dataList, inputs, SensorsService);
        renderer.update();
      }
    };
  }
]);
