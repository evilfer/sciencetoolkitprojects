angular.module('myApp').directive('nqMap', [function() {
    return {
      scope: {
        'maps': '=',
        'project': '=',
        'profileid': '='        
      },
      
      link: function(scope, element, attrs) {
        var map = scope.maps[scope.profileid];
        var dataList = scope.project.series[scope.profileid];

        var renderer = new nspMapRenderer(element, map, dataList);
        renderer.update();
      }
    };
  }
]);
