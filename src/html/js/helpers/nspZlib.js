

var nspZlib = {
  base64toUint8Array: function(base64) {
    var myArray = base64DecToArr(base64);
    return myArray;
  },
  decompressArray: function(base64) {
    var compressed = this.base64toUint8Array(base64);
    var inflate = new Zlib.Inflate(compressed);
    var plain = inflate.decompress();
    return plain;
  },
  decompressStr: function(base64) {
    var a = this.decompressArray(base64);
    var plain = "";
    for (var i = 0; i < a.length; i++) {
      plain += String.fromCharCode(a[i]);
    }
    return plain;
  },
  decompressObj: function(base64) {
    var plain = this.decompressStr(base64);
    return JSON.parse(plain);
  }
};
