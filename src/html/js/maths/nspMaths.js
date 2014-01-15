
var nspMaths = {
  transforms: {},
  register: function(name, t) {
    this.transforms[name] = t;
  },
  transformSeries: function(rawSeries, profiles) {
    var series = {};
    for (var profileId in rawSeries) {
      var rawProfileSeriesList = rawSeries[profileId];
      var tProfileSeriesList = [];
      
      
      for (var seriesI = 0; seriesI < rawProfileSeriesList.length; seriesI ++) {
        var rawProfileSeries = rawProfileSeriesList[seriesI];
        var tProfileSeries = {id: rawProfileSeries.id, userid: rawProfileSeries.userid, data: {}, metadata: rawProfileSeries.metadata};
        
        for (var input in rawProfileSeries.data) {
          var rawProfileSeriesInputData = rawProfileSeries.data[input];
          var tProfileSeriesInputData = {
            0: rawProfileSeriesInputData
          };
          var transformations = profiles[profileId].inputs[input].transformations;
          for (var variable in transformations) {
            var t = transformations[variable];
            tProfileSeriesInputData[variable] = this.transform(t.transformation, tProfileSeriesInputData[t.sourceid]);
          }
          
          tProfileSeries.data[input] = tProfileSeriesInputData;
        }
        
        tProfileSeriesList.push(tProfileSeries);        
      }
      
      series[profileId] = tProfileSeriesList;
    }
    
    return series;
  },
  transform: function(name, series) {
    return this.transforms[name](series);
  },
  zeros: function(n) {
    var z = new Array(n);
    for (var i = 0; i < n; i++) {
      z[i] = 0;
    }
    return z;
  },
  zerosT: function(n, t) {
    var z = new Array(n);
    z[0] = t;
    for (var i = 1; i < n; i++) {
      z[i] = 0;
    }
    
    return z;
  },
  arrayT: function(n, t) {
    var a = new Array(n);
    a[0] = t;
    return a;
  }
};
