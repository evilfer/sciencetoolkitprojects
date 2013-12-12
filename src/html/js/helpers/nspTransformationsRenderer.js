
var nspTransformationsRenderer = function($element, model, data) {
  this.$element = $element;
  this.model = model;
  this.data = data;
  
  this.boxes = {};
};

nspTransformationsRenderer.prototype.clear = function() {
  this.$element.html('');
};

nspTransformationsRenderer.prototype.update = function() {
  this.clear();
  this.render();
};


nspTransformationsRenderer.prototype.render = function() {
  if (typeof this.data.sensorTypes[this.model.sensor] !== 'undefined') {
    var dataBox = {
      title: 'Raw data',
      type: this.data.sensorTypes[this.model.sensor].output,
      id: 0
    };
    
    this.createDataBox(dataBox);
  }
};

nspTransformationsRenderer.prototype.createDataBox = function(dataBox) {
  var $box = angular.element('<div>');
  $box.html(dataBox.title + '<br/>' + dataBox.type);
  this.$element.append($box);
};





