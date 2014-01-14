/*global angular, Math*/

angular.module('myApp').controller('CreateEditProfileTitleCtrl', function($scope, ModifyProjectService) {
  
  $scope.saveSrv = ModifyProjectService;
  
  $scope.view = {
    isOpen: false,
    editingTitle: null,
    editingRequiresLocation: null,
    okButtonDisabled: function() {
      return !(this.editingTitle && this.editingTitle.length > 0);
    }
  };
  
  $scope.actions = {
    open: function() {
      $scope.view.editingTitle = $scope.profile.title;
      $scope.view.editingRequiresLocation = $scope.profile.requires_location;
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
      $scope.profile.requires_location = $scope.view.editingRequiresLocation;
      $scope.saveSrv.setProfileTitle($scope.project.id, $scope.profile);
      this.close();
    },
    makeActive: function(active) {
      $scope.modifyProjectSrv.setProfileIsActive($scope.project.id, $scope.profile.id, active);
    },
    deleteProfile: function() {
      $scope.modifyProjectSrv.deleteProfile($scope.project.id, $scope.profile.id);
    }
  };
});
