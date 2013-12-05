

var nspUpdater = function(httpSrv, url, callbacks) {
  this.defaultPeriod = 1000;
  this.updatePeriod = this.defaultPeriod;
  this.updateTimeout = null;

  this.httpSrv = httpSrv;
  this.url = url;
  this.working = false;
  
  this.callbacks = callbacks;
  this.data = null;
};

nspUpdater.prototype.setRequestData = function(data) {
  this.data = {params: data};
};

nspUpdater.prototype.stop = function() {
  this.working = false;
  window.clearTimeout(this.updateTimeout);
};


nspUpdater.prototype.updateNow = function(periodic) {
  this.working = this.working || periodic;
  this.updatePeriod = this.defaultPeriod;
  this._runUpdate();
};

nspUpdater.prototype.destroy = function() {
  window.clearTimeout(this.updateTimeout);
};

nspUpdater.prototype._runUpdate = function() {
  var self = this;
  
  if (self.callbacks.onUpdate) {
    self.callbacks.onUpdate();
  }

  window.clearTimeout(this.updateTimeout);

  this.httpSrv.get(this.url, this.data).then(function(result) {
    var resetUpdatePeriod = self.callbacks.onSuccess && self.callbacks.onSuccess(result.data);
    
    if (self.working) {

      if (resetUpdatePeriod) {
        self.updatePeriod = self.defaultPeriod;
      } else {
        self.updatePeriod += self.defaultPeriod;
      }

      window.clearTimeout(self.updateTimeout);

      self.updateTimeout = window.setTimeout(function() {
        self._runUpdate();
      }, self.updatePeriod);
    }
  });

};

