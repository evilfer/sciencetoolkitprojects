/*global angular, Math*/

angular.module('myApp').controller('CreateEditProfileTitleCtrl', function($scope, ModifyProjectService) {
  
  $scope.saveSrv = ModifyProjectService;
  
  $scope.view = {
    isOpen: false,
    editingTitle: null,
    okButtonDisabled: function() {
      return false;
    }
  };
  
  $scope.actions = {
    open: function() {
      $scope.view.editingTitle = $scope.profile.title;
      $scope.view.isOpen = true;      
    },
    close: function() {
      $scope.view.isOpen = false;
    },
    cancel: function() {
      this.close();      
    },
    save: function() {
      $scope.profile.title = $scope.view.editingTitle;
      $scope.saveSrv.setProfileTitle($scope.project.id, $scope.profile);
      this.close();
    }
  };
});
