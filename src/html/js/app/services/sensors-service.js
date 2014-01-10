/*global angular*/

angular.module('nspServices').factory('SensorsService', [function() {
    var service = {
      sensorTypes: {
        'acc': {
          name: 'Accelerometer',
          output: '[txyz]',
          labels: ['X (m/s)', 'Y (m/s)', 'Z (m/s)'],
          units: {'m': 1, 's': -2}
        },
        'lacc': {
          name: 'Linear acceleration',
          output: '[txyz]',
          labels: ['X (m/s)', 'Y (m/s)', 'Z (m/s)'],
          units: {'m': 1, 's': -2}
        },
        'snd': {
          name: 'Sound',
          output: '[(tx)]',
          labels: ['Snd (dB)'],
          units: {'dB': 1}
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
        'modulus': {
          name: "Modulus",
          data: {
            'xyz': 'x',
            'txyz': 'tx',
            '[xy]': '[x]',
            '[txyz]': '[tx]'
          },
          units: {}
        },
        'integrate': {
          name: "Integrate",
          data: {
            '[tx]': '[tx]',
            '[txy]': '[txy]',
            '[txyz]': '[txyz]'
          },
          units: {'s': 1}
        },
        'gety': {
          name: "Get Y",
          data: {
            'xyz': 'x',
            'txyz': 'tx',
            '[xy]': '[x]',
            '[txyz]': '[tx]'
          },
          units: {}
        },
        'removecc': {
          name: "Filter continuos comp",
          data: {
            '[tx]': '[tx]'
          },
          units: {}
        },
        'max': {
          name: "Max value",
          data: {
            '[x]': 'x',
            '[tx]': 'tx'
          },
          units: {}
        },
        'min': {
          name: "Min value",
          data: {
            '[x]': 'x',
            '[tx]': 'tx'
          },
          units: {}
        }
      },
      getUnits: function(sensor, index) {
        var u = this.sensorTypes[sensor].units;
        return angular.isArray(u) ? u[index] : u;
      },
      unitsToStr: function(units) {
        var output = '';
        for (var unit in units) {
          var n = units[unit];
          if (n !== 0) {
            if (output.length > 0) {
              output += ' ';
            }

            output += unit;
            if (n !== 1) {
              output += '<sup>' + n + '</sup>';
            }
          }
        }
        return output;
      },
      transformUnits: function(units, transform) {
        var change = this.transformations[transform].units;
        for (var unit in change) {
          if (unit in units) {
            units[unit] += change[unit];
          } else {
            units[unit] = change[unit];
          }
        }
      }


    };

    return service;
  }]);