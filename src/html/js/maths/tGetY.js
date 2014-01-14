
nspMaths.register('gety', function(series) {
  var result = [];
  for (var i = 0; i < series.length; i++) {
    var row = series[i];
    var trow = [row[0], row[2]];
    result.push(trow);
  }
  return result;
});
