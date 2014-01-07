/*global angular*/

angular.module('nspServices').factory('SensorsService', [function() {
    var service = {
      sensorTypes: {
        'acc': {
          name: 'Accelerometer',
          output: '[(txyz)]',
          labels: ['X (m/s)', 'Y (m/s)', 'Z (m/s)']
        },
        'lacc': {
          name: 'Linear acceleration',
          output: '[(txyz)]',
          labels: ['X (m/s)', 'Y (m/s)', 'Z (m/s)']
        },
        'snd': {
          name: 'Sound',
          output: '[(tx)]',
          labels: ['Snd (dB)']
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