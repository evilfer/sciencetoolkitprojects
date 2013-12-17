/*global angular*/

angular.module('nspServices').factory('SensorsService', [function() {
    var service = {
      sensorTypes: {
        'acc': {
          name: 'Accelerometer',
          output: '[(txyz)]'
        },
        'snd': {
          name: 'Sound',
          output: '[(tx)]'
        }
      },
      dataTypes: {
        '(x)': 'Variable',
        '(xy)': 'Vector 2D',
        '(xyz)': 'Vector 3D',
        '(tx)': 'Variable/time',
        '(txy)': 'Vector 2D/time',
        '(txyz)': 'Vector 3D/time',
        '[(x)]': 'Variable sequence',
        '[(xy)]': 'Vector 2D sequence',
        '[(xyz)]': 'Vector 3D sequence',
        '[(tx)]': 'Variable/time sequence',
        '[(txy)]': 'Vector 2D/time sequence',
        '[(txyz)]': 'Vector 3D/time sequence'
      },
      transformations: {
        'vector-module': {
          '(xyz)': '(x)',
          '(txyz)': '(tx)',
          '[(xyz)]': '[(x)]',
          '[(txyz)]': '[(tx)]'
        }
      }
    };

    return service;
  }]);