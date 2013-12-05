/*global angular*/

angular.module('nspServices').factory('ProjectIdService', [function() {
    return {
      check: function(stateParams) {
        var isNew = typeof stateParams.projectId === 'undefined' || !stateParams.projectId;
        var projectId = isNew ? false : parseInt(stateParams.projectId);
        return {
          isNew: isNew,
          projectId: projectId
        };        
      }
    };
  }]);
