
nspMaths.register('removecc', function(series) {
  var result = [];
  
  if (series.length > 0) {
    var n = series[0].length - 1;
    
    var avg = nspMaths.zeros(n);

    for (var i = 0; i < series.length; i++) {
      for (var j = 0; j < n; j++) {
        avg[j] += series[i][j + 1];
      }
    }

    for (var i = 0; i < n; i++) {
      avg[i] /= series.length;
    }
    
    for (var i = 0; i < series.length; i++) {
      var row = series[i];
      var trow = nspMaths.arrayT(n+1, row[0]);
      for (var j = 0; j < n; j++) {
        trow[j+1] = row[j+1] - avg[j];
      }
      result.push(trow);
    }
    
    return result;
  }
});
