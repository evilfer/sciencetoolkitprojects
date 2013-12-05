/*global angular*/


angular.module('nspServices').factory('UpdateNotifyService', [function(SyncService) {

    var service = {
      somethingChanged: function() {
        SyncService.somethingChanged();
      }
    };

    return service;
  }]);