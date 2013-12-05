/*global angular*/


angular.module('nspServices').factory('UpdateNotifyService', ['SyncService', function(SyncService) {

    var service = {
      somethingChanged: function() {
        SyncService.somethingChanged();
      }
    };

    return service;
  }]);