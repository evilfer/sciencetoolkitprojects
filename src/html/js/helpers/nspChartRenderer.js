
var nspChartRenderer = function($element, chart, list) {
  this.$element = $element;
  this.chart = chart;
  this.list = list;
};

nspChartRenderer.prototype.update = function() {

  if (this.list) {

    var xaxes = [{}];
    var yaxes = [];
    var sensor_yaxes = {};
    var series = [];

    for (var i = 0; i < this.list.length; i++) {
      var data = this.list[i].data;
      for (var sensor in data) {
        var sensor_series_md = data[sensor];
        if (sensor_series_md.length > 0) {
          var p;
          if (sensor in sensor_yaxes) {
            p = sensor_yaxes[sensor];
          } else {
            p = yaxes.length;
            yaxes.push({});
            sensor_yaxes[sensor] = p;
          }

          var yaxis = p + 1;

          var dim = sensor_series_md[0].length - 1;

          for (var d = 1; d <= dim; d++) {
            var sensor_series = [];
            for (var j = 0; j < Math.min(10, sensor_series_md.length); j++) {
              sensor_series.push([sensor_series_md[j][0], sensor_series_md[j][d]]);
            }
            series.push({label: "" + d, data: sensor_series, yaxis: yaxis});
          }
        }
      }

      this.$element.css({width: '100%', height: '500px'});

      $.plot(this.$element, series, {
        xaxes: xaxes,
        yaxes: yaxes
      });
    }
  }


};




