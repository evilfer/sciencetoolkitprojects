
nspMaths.register('min', function(series) {
  
  if (series.length > 0) {
    var hasTime = series[0].length === 2;
    var vi = hasTime ? 1 : 0;
    var min = Number.POSITIVE_INFINITY;
    for (var i = 0; i < series.length; i++) {
      if (series[i][vi] < min) {
        min = series[i][vi];
      }
    }
    
    return [[min]];
  } else {
    return [[0]];
  }
});
