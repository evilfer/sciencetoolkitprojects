/*global angular*/

angular.module('nspServices').factory('SubscriptionService', ['$http', function($http) {
    var service = {
      working: false
    };

    service._post = function(data) {
      this.working = true;
      var self = this;

      console.log(data);
      return $http.post('/api/subscriptions', data).then(function(result) {
        console.log(result.data);
        self.working = false;
        return result.data;
      });
    };

    service.joinProject = function(id) {
      return this._post({
        'action': 'join',
        'id': id
      });
    };
    service.leaveProject = function(id) {
      return this._post({
        'action': 'leave',
        'id': id
      });
    };
    service.addProfile = function(projectid, profileid) {
      return this._post({
        'action': 'addprofile',
        'id': projectid,
        'profileid': profileid
      });
    };
    service.removeProfile = function(projectid, profileid) {
      return this._post({
        'action': 'removeprofile',
        'id': projectid,
        'profileid': profileid
      });
    };

    return service;
  }
]);
