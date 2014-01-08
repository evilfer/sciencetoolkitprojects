/*global angular*/

angular.module('nspServices').factory('SensorsService', [function() {
    var service = {
      sensorTypes: {
        'acc': {
          name: 'Accelerometer',
          output: '[txyz]',
          labels: ['X (m/s)', 'Y (m/s)', 'Z (m/s)']
        },
        'lacc': {
          name: 'Linear acceleration',
          output: '[txyz]',
          labels: ['X (m/s)', 'Y (m/s)', 'Z (m/s)']
        },
        'snd': {
          name: 'Sound',
          output: '[(tx)]',
          labels: ['Snd (dB)']
        }
      },
      dataTypes: {
        'x': '1D',
        'xy': '2D',
        'xyz': '3D',
        'tx': '1D-time',
        'txy': '2D-time',
        'txyz': '3D-time',
        '[x]': '1D series',
        '[xy]': '2D series',
        '[xyz]': '3D series',
        '[tx]': '1D-time series',
        '[txy]': '2D-time series',
        '[txyz]': '3D-time series'
      },
      transformations: {
        'module': {
          name: "Module",
          data: {
            'xyz': 'x',
            'txyz': 'tx',
            '[xy]': '[x]',
            '[txyz]': '[tx]'
          }
        },
        'integrate': {
          name: "Integrate",
          data: {
            '[tx]': '[tx]',
            '[txy]': '[txy]',
            '[txyz]': '[txyz]'
          }
        },
        'max': {
          name: "Max value",
          data: {
            '[x]': 'x',
            '[tx]': 'tx'
          }
        },
        'min': {
          name: "Min value",
          data: {
            '[x]': 'x',
            '[tx]': 'tx'
          }
        }
      }
    };

    return service;
  }]);