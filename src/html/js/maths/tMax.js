
nspMaths.register('max', function(series) {
  
  if (series.length > 0) {
    var hasTime = series[0].length === 2;
    var vi = hasTime ? 1 : 0;
    var max = Number.NEGATIVE_INFINITY;
    for (var i = 0; i < series.length; i++) {
      if (series[i][vi] > max) {
        max = series[i][vi];
      }
    }
    
    return [[max]];
  } else {
    return [[0]];
  }
});
