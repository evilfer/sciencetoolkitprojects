/*global angular*/

angular.module('nspServices').factory('TransformationSelectorService', [function() {
    var service = {
      selection: {},
      init: function(project) {
        if (project) {
          if (!(project.id in this.selection)) {
            this.selection[project.id] = {};
          }

          for (var pi in project.profiles) {
            var profile = project.profiles[pi];

            if (!(profile.id in this.selection[project.id])) {
              this.selection[project.id][profile.id] = {};
            }

            for (var ii in profile.inputs) {
              var input = profile.inputs[ii];

              if (!(input.id in this.selection[project.id][profile.id])) {
                this.selection[project.id][profile.id][input.id] = {0: true};
              }

              for (var vi in input.transformations) {
                var t = input.transformations[vi];

                if (!(t.id in this.selection[project.id][profile.id][input.id])) {
                  this.selection[project.id][profile.id][input.id][t.id] = true;
                }
              }
            }
          }
        }
      }
    };

    return service;
  }]);