

var nspUpdater = function(httpSrv, url, data, success) {
  this.defaultPeriod = 1000;
  this.updatePeriod = this.defaultPeriod;
  this.updateTimeout = null;
  
  this.httpSrv = httpSrv;
  this.url = url;
  this.data = data;
  this.success = success;
};

nspUpdater.prototype.setCallback = function(successCallback) {
  this.success = successCallback;
};


nspUpdater.prototype.updateNow = function() {
  this.updatePeriod = this.defaultPeriod;
  this._runUpdate();
};

nspUpdater.prototype.destroy = function() {
  window.clearTimeout(this.updateTimeout);
};

nspUpdater.prototype._runUpdate = function() {
  var self = this;

  window.clearTimeout(this.updateTimeout);
  
  this.httpSrv.get(this.url, this.data).then(function(result) {
    var resetUpdatePeriod = self.success && self.success(result.data);
    
    if (resetUpdatePeriod) {
      self.updatePeriod = self.defaultPeriod;
    } else {
      self.updatePeriod += self.defaultPeriod;
    }

    window.clearTimeout(self.updateTimeout);

    self.updateTimeout = window.setTimeout(function() {
      self._runUpdate();
    }, self.updatePeriod);
  });

};

