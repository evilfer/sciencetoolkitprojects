
nspMaths.register('integrate', function(series) {
  var result = [];

  if (series.length > 0) {
    var n = series[0].length;

    result.push(nspMaths.zerosT(n, series[0][0]));

    for (var i = 1; i < series.length; i++) {
      var trow = nspMaths.arrayT(n, series[i][0]);
      for (var j = 1; j < n; j++) {
        trow[j] = result[i-1][j] + .0005 * (series[i][0] - series[i-1][0]) * (series[i][j] + series[i-1][j]);
      }
      result.push(trow);
    }
    
    return result;
  }
});
