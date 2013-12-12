

var nspChildrenManager = {
  createChild: function(containerParent, containerName) {
    if (typeof containerParent[containerName] !== 'object') {
      containerParent[containerName] = [];
    }
    var id = this.getNextId(containerParent, containerName);

    containerParent[containerName].push({id: id});
  },
  getNextId: function(containerParent, containerName) {
    var id = 0;
    for (var i = 0; i < containerParent[containerName].length; i++) {
      id = Math.max(containerParent[containerName][i].id, i + 1);
    }
    return id;
  },
  deleteChild: function(container, id) {
    var index = this.getIndex(container, id);
    if (index !== false) {
      container.splice(index, 1);
    }
  },
  getIndex: function(container, id) {
    for (var i = container.length - 1; i >= 0; i--) {
      if (container[i].id === id) {
        return i;
      }
    }
    return false;
  }
};



