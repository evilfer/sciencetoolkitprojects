
var nspChartRenderer = function($element, chart, dataList, inputs, SensorsService) {
  this.$element = $element;
  this.chart = chart;
  this.dataList = dataList;
  this.inputs = inputs;
  this.sensorsSrv = SensorsService;
};

nspChartRenderer.prototype.selectType = function(dataType) {
  switch (dataType) {
    case 'x':
    case 'xy':
    case 'xyz':
      return {
        sequence: false,
        time: false,
        type: 'bars',
        d: dataType.length
      };
    case 'tx':
    case 'txy':
    case 'txyz':
      return {
        sequence: false,
        time: true,
        type: 'points',
        d: dataType.length - 1
      };
    case '[x]':
    case '[xy]':
    case '[xyz]':
      return {
        sequence: true,
        time: false,
        type: 'lines',
        d: dataType.length - 2
      };
    case '[tx]':
    case '[txy]':
    case '[txyz]':
      return {
        sequence: true,
        time: true,
        type: 'lines',
        d: dataType.length - 3
      };
  }
};

nspChartRenderer.prototype.update = function() {

  if (this.dataList) {

    var xaxes = [{
        axisLabel: "Time (s)"
      }];
    var yaxes = [];
    var sensor_yaxes = {};
    var seriesList = [];

    var chartType = this.selectType(this.chart.type);
    for (var i = 0; i < this.dataList.length; i++) {
      var data = this.dataList[i].data;

      var color = i;

      var input_series_data = data[this.chart.input][this.chart.variable];
      var x0 = chartType.time ? (chartType.sequence ? -input_series_data[0][0] : 0) : 1;

      if (input_series_data.length > 0) {
        var p;
        if (this.chart.unitLabel in sensor_yaxes) {
          p = sensor_yaxes[this.chart.unitLabel];
        } else {
          p = yaxes.length;
          yaxes.push({
            axisLabel: this.chart.unitLabel,
            opts: {color: 'black'}
          });
          sensor_yaxes[this.chart.unitLabel] = p;
        }

        var yaxis = p + 1;


        var yi0 = chartType.time ? 1 : 0;

        var showLabel = true;

        for (var d = 0; d < chartType.d; d++) {
          var series = [];

          for (var j = 0; j < input_series_data.length; j++) {
            var x = chartType.time ? (chartType.sequence ? .001 * (input_series_data[j][0] - input_series_data[0][0]) : input_series_data[j][0]) : i+1;
            series.push([x, input_series_data[j][d + yi0]]);
          }

          var label;
          if (showLabel) {
            var label = i + 1;
            showLabel = false;
          } else {
            label = false;
          }
          var seriesItem = {label: label, data: series, yaxis: yaxis, color: color};
          seriesItem[chartType.type] = {show: true};
          seriesList.push(seriesItem);
        }
      }
    }

    this.$element.css({width: '100%', height: '500px'});
    $.plot(this.$element, seriesList, {
      xaxes: xaxes,
      yaxes: yaxes
    });
  }
//
//nspChartRenderer.prototype.update = function() {
//
//  if (this.dataList) {
//
//    var xaxes = [{}];
//    var yaxes = [];
//    var sensor_yaxes = {};
//    var series = [];
//
//    var showLabel = true;
//
//
//
//    for (var i = 0; i < this.dataList.length; i++) {
//      var data = this.dataList[i].data;
//
//      var color = 0;
//      
//      for (var input in data) {
//        if (input_series_data.length > 0) {
//          var p;
//          if (input in sensor_yaxes) {
//            p = sensor_yaxes[input];
//          } else {
//            p = yaxes.length;
//            yaxes.push({});
//            sensor_yaxes[input] = p;
//          }
//
//          var yaxis = p + 1;
//
//          var dim = input_series_data[0].length - 1;
//
//          var t0 = input_series_data[0][0];
//
//          for (var d = 1; d <= dim; d++) {
//            var sensor_series = [];
//
//            for (var j = 0; j < input_series_data.length; j++) {
//              var t = .001 * (input_series_data[j][0] - t0);
//              sensor_series.push([t, input_series_data[j][d]]);
//            }
//
//
//            var label;
//            if (showLabel) {
//              var sensor = this.inputs[input].sensor;
//              var label = this.sensorsSrv.sensorTypes[sensor].labels[d-1];
//            } else {
//              label = false;
//            }
//            series.push({label: label, data: sensor_series, yaxis: yaxis, color: color});
//            color++;
//          }
//        }
//      }
//
//      showLabel = false;
//    }
//
//    this.$element.css({width: '100%', height: '500px'});
//    $.plot(this.$element, series, {
//      xaxes: xaxes,
//      yaxes: yaxes
//    });
//  }


};




