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
            '[tx]': 'x'
          },
          units: {}
        },
        'min': {
          name: "Min value",
          data: {
            '[x]': 'x',
            '[tx]': 'x'
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

        var singleNegativeUnit = -1;
        for (var unit in units) {
          if (units[unit] < 0) {
            singleNegativeUnit = singleNegativeUnit === -1 ? unit : -2;
          }
        }

        for (var unit in units) {
          var n = units[unit];
          if (n !== 0 && unit !== singleNegativeUnit) {
            if (output.length > 0) {
              output += ' ';
            }

            output += unit;
            if (n !== 1) {
              output += '<sup>' + n + '</sup>';
            }
          }
        }

        if (singleNegativeUnit in units) {
          output += ' / ' + unit;
          if (units[unit] !== -1) {
            output += '<sup>' + -n + '</sup>';
          }
        }

        return output;
      },
      transformType: function(type, transform) {
        return this.transformations[transform].data[type];
      },
      transformUnits: function(units, transform) {
        var change = this.transformations[transform].units;
        var result = nspClone(units);

        for (var unit in change) {
          if (unit in result) {
            result[unit] += change[unit];
          } else {
            result[unit] = change[unit];
          }
        }
        return result;
      }


    };

    return service;
  }]);