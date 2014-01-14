
nspMaths.register('modulus', function(series) {
  var result = [];
  for (var i = 0; i < series.length; i++) {
    var row = series[i];
    var trow = [row[0], 0];
    for (var j = 0; j < row.length; j++) {
      trow[1] += row[j] * row[j];
    }
    trow[1] = Math.sqrt(trow[1]);
    result.push(trow);
  }
  return result;
});
