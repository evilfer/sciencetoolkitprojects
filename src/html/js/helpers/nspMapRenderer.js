
var nspMapRenderer = function(element, mapVariables, dataList) {
  this.element = element;
  this.mapVariables = mapVariables;
  this.dataList = dataList;
  this.map = null;
  this.markers = {};


  this.icons = {
    'red': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    'green': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  };

  this.needToInitCloseMarkers = false;

  this.init();
  this.update();
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

      var goldStar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><linearGradient id='gradient'><stop offset='10%' stop-color='#F00'/><stop offset='90%' stop-color='#fcc'/> </linearGradient><rect fill='url(#gradient)' x='0' y='0' width='100%' height='100%'/></svg>";

      var marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon: goldStar, //this.icons['green'],
        title: "" + (i + 1),
        series_id: i
      });

      this.oms.addMarker(marker);
      this.markers[i] = {
        marker: marker,
        infowindow: new google.maps.InfoWindow({content: "series " + (i + 1)})
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
