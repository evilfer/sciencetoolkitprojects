
var nspMapRenderer = function(element, mapVariables, dataList) {
  this.element = element;
  
  this.mapVariables = [];
  for (var input_id in mapVariables) {
    for (var variable_id in mapVariables[input_id]) {
      this.mapVariables.push({input: input_id, variable: variable_id, label: mapVariables[input_id][variable_id]});
    }      
  }
  
  this.dataList = dataList;
  this.map = null;
  this.markers = {};
  
  var max = 0;
  var min = 0;
  
  for (var i = 0; i < dataList.length; i++) {
    for (var vi = 0; vi < this.mapVariables.length; vi++) {
      var mv = this.mapVariables[vi];
      console.log(mv.label);
      var value = this.dataList[i].data[mv.input][mv.variable][0][0];
      max = Math.max(max, value);
      min = Math.min(min, value);
    }
  }
  
  this.iconMaker = new nspMapIcons(this.mapVariables.length, max, min);

  this.needToInitCloseMarkers = false;

  this.init();
  this.update();
};

nspMapRenderer.prototype.getIcon = function(i, mode) {
  var values = [];
  for (var vi = 0; vi < this.mapVariables.length; vi++) {
    var mv = this.mapVariables[vi];
    var value = this.dataList[i].data[mv.input][mv.variable][0][0];
    values.push(value);
  }
  
  return this.iconMaker.getIcon(values, mode);
};

nspMapRenderer.prototype.getLatLng = function(i, forceObj) {
  var location = i < this.dataList.length ? this.dataList[i].metadata.location : false;
  return location ? new google.maps.LatLng(location.lat, location.lon) : forceObj ? new google.maps.LatLng(0, 0) : false;
};

nspMapRenderer.prototype.init = function() {
  this.element.css('height', '600px');

  var mapOptions = {
    center: this.getLatLng(0, true),
    zoom: 8
  };

  this.map = new google.maps.Map(this.element[0], mapOptions);
  this.oms = new OverlappingMarkerSpiderfier(this.map);

  var self = this;


  this.oms.addListener('click', function(marker, event) {
    console.log('oms');
    self.markers[marker.series_id].infowindow.open(self.map, marker);
  });


  this.oms.addListener('spiderfy', function(markers) {
    self.setMarkersIcon(markers, 'green');
    for (var i = 0; i < markers.length; i++) {
      self.markers[markers[i].series_id].infowindow.open(self.map, markers[i]);
    }
  });

  this.oms.addListener('unspiderfy', function(markers) {
    self.setMarkersIcon(markers, 'red');
  });

  google.maps.event.addListener(this.map, 'idle', function() {
    self.idle();
  });

};

nspMapRenderer.prototype.reset = function() {
  for (var id in this.markers) {
    this.markers[id].marker.setMap(null);
    this.markers[id].infowindow.close();
  }
  this.oms.clearMarkers();
  this.markers = {};
};

nspMapRenderer.prototype.update = function() {
  this.reset();
  for (var i = 0; i < this.dataList.length; i++) {
    var pos = this.getLatLng(i);
    if (pos) {

      var marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: this.getIcon(i, 'normal'),
        title: "" + (i + 1),
        series_id: i
      });

console.log(this.dataList[i]);
      this.oms.addMarker(marker);
      this.markers[i] = {
        marker: marker,
        infowindow: new google.maps.InfoWindow({content: "series " + (i + 1) + '<br/>' + this.dataList[i].id})
      };
    }
  }

  this.needToInitCloseMarkers = true;

};

nspMapRenderer.prototype.idle = function() {
  if (this.needToInitCloseMarkers) {
    this.needToInitCloseMarkers = false;
    this.setMarkersIcon(this.oms.markersNearAnyOtherMarker(), 'red');
  }
};

nspMapRenderer.prototype.setMarkersIcon = function(markers, icon) {
  for (var i = 0; i < markers.length; i++) {
    //markers[i].setIcon(this.icons[icon]);
  }
};
