
var nspChartRenderer = function($element, chart, dataList, inputs, SensorsService) {
  this.$element = $element;
  this.chart = chart;
  this.dataList = dataList;
  this.inputs = inputs;
  this.sensorsSrv = SensorsService;
};


nspChartRenderer.prototype.update = function() {

  if (this.dataList) {

    var xaxes = [{}];
    var yaxes = [];
    var sensor_yaxes = {};
    var series = [];

    var showLabel = true;



    for (var i = 0; i < this.dataList.length; i++) {
      var data = this.dataList[i].data;

      var color = 0;

      var input_series_data = data[this.chart.input][this.chart.variable];
      if (input_series_data.length > 0) {
        var p;
        if (this.chart.input in sensor_yaxes) {
          p = sensor_yaxes[this.chart.input];
        } else {
          p = yaxes.length;
          yaxes.push({});
          sensor_yaxes[this.chart.input] = p;
        }

        var yaxis = p + 1;

        var dim = input_series_data[0].length - 1;

        var t0 = input_series_data[0][0];

        for (var d = 1; d <= dim; d++) {
          var sensor_series = [];

          for (var j = 0; j < input_series_data.length; j++) {
            var t = .001 * (input_series_data[j][0] - t0);
            sensor_series.push([t, input_series_data[j][d]]);
          }


          var label;
          if (showLabel) {
            var sensor = this.inputs[this.chart.input].sensor;
            var label = this.sensorsSrv.sensorTypes[sensor].labels[d - 1];
          } else {
            label = false;
          }
          series.push({label: label, data: sensor_series, yaxis: yaxis, color: color});
          color++;
        }
      }

      showLabel = false;
    }

    this.$element.css({width: '100%', height: '500px'});
    $.plot(this.$element, series, {
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




