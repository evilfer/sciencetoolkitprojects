
var nspMapIconsConsts = {
  plotHeight: 20,
  plotWidth: 20,
  vMargin: 5,
  hMargin: 5,
  ohMargin: 1,
  ovMargin: 1,
  maxLineWidth: 5,
  arroWidth: 20,
  arrowHeight: 20
};

var nspMapIcons = function(n, max, min) {
  this.n = n;
  this.max = Math.max(max, 0);
  this.min = Math.min(min, 0);
  this.range = this.max - this.min;

  this.iconWidth = nspMapIconsConsts.plotWidth + 2 * (nspMapIconsConsts.hMargin + nspMapIconsConsts.ohMargin);
  this.iconHeight = nspMapIconsConsts.plotHeight + 2 * (nspMapIconsConsts.vMargin + nspMapIconsConsts.ovMargin) + nspMapIconsConsts.arrowHeight;


  if (this.range > 0) {
    this.scale = nspMapIconsConsts.plotHeight / this.range;
    this.zeroH = this.min * this.scale + nspMapIconsConsts.arrowHeight + nspMapIconsConsts.vMargin + nspMapIconsConsts.ovMargin;
  } else {
    this.zeroH = 0;
    this.scale = 0;
  }

  var lineSpace = nspMapIconsConsts.plotWidth / (this.n + 1);
  this.colors = [];
  this.positions = [];
  for (var i = 0; i < this.n; i++) {
    this.colors.push(nspColorGenerator.getColor(i, 1, .7));
    this.positions.push(nspMapIconsConsts.ohMargin + nspMapIconsConsts.hMargin + lineSpace * (i + 1));
  }
  this.lineWidth = Math.min(nspMapIconsConsts.maxLineWidth, lineSpace);

  this.svgBg = this.getBg();
  this.svgLine = this.getZeroLine();
};

nspMapIcons.prototype.getZeroLine = function() {
  var dx = .5 * nspMapIconsConsts.plotWidth;
  var cx = .5 * this.iconWidth;
  var y = this.zeroH;
  var line = '<line x1="' + (cx - dx) + '" y1="' + y + '" x2="' + (cx + dx) + '" y2="' + y + '" style="stroke:black;stroke-width:1" />';
  return line;
};

nspMapIcons.prototype.getBg = function() {
  var cx = .5 * this.iconWidth;
  var hw = cx - nspMapIconsConsts.ohMargin;
  var w = 2 * hw;
  var y0 = this.iconHeight - nspMapIconsConsts.ovMargin;
  var aw = .5 * nspMapIconsConsts.arroWidth;
  var sdx = hw - aw;
  var dy = nspMapIconsConsts.plotHeight + 2 * nspMapIconsConsts.vMargin;

  var bg = '<path style="stroke:black;stroke-width:1; fill:#eee;" d="m' + cx + ',' + y0
          + ' a' + aw + "," + nspMapIconsConsts.arrowHeight + ' 0 0,1 ' + aw + ',-' + nspMapIconsConsts.arrowHeight
          + ' h' + sdx + ' v-' + dy + 'h-' + w + ' v' + dy + ' h' + sdx
          + ' a' + aw + "," + nspMapIconsConsts.arrowHeight + ' 0 0,1 ' + aw + ',' + nspMapIconsConsts.arrowHeight
          + '"/>';

  return bg;
};

nspMapIcons.prototype.getIcon = function(values, mode) {
  var icon = 'data:image/svg+xml,<svg width="' + this.iconWidth + '" height="' + this.iconHeight + '" xmlns="http://www.w3.org/2000/svg"><g>'
          + this.svgBg;
  
  for (var i = 0; i < values.length; i++) {
    icon += '<line x1="' + this.positions[i] + '" y1="' + this.zeroH + '" x2="' + this.positions[i] + '" y2="' + (this.zeroH - this.scale * values[i]) 
            + '" style="stroke:' + this.colors[i] + ';stroke-width:' + this.lineWidth + '" />';
  }
  
  icon += this.svgLine + '</g></svg>';
  return icon;
};


