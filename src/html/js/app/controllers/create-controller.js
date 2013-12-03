/*global angular, Math*/

var myApp = angular.module('myApp');

myApp.controller('CreateCtrl', function($scope, ProjectList, ProjectCreate) {
  $scope.view = {
    formOpen: false,
    openProjectForm: function(projectId) {
      if (projectId && $scope.projects[projectId]) {
        $scope.editingProject.open($scope.projects[projectId]);
      } else {
        $scope.editingProject.reset();
      }
      this.formOpen = true;
    },
    closeProjectForm: function() {
      this.formOpen = false;
      $scope.editingProject.reset();
    }
  };

  $scope.awaitingDataAnswer = false;

  $scope.listsrv = ProjectList.getList('owned');
  $scope.projects = {};

  $scope.createsrv = ProjectCreate.create($scope.listsrv);

  $scope.watches = [$scope.$watch('listsrv.projects', function() {
      $scope.projects = $scope.listsrv.projects;
    }), $scope.$watch('createsrv.working', function() {
      if ($scope.awaitingDataAnswer && !$scope.createsrv.working) {
        $scope.view.closeProjectForm();
      }

      $scope.awaitingDataAnswer = $scope.createsrv.working;
    })];

  $scope.editingProject = {
    project: null,
    open: function(project) {
      this.project = nspClone(project);
    },
    reset: function() {
      this.project = {};
    },
    isNew: function() {
      return !Boolean(this.project.id);
    },
    save: function() {
      $scope.createsrv.submit(this.project);
    },
    okButtonDisabled: function() {
      return $scope.awaitingDataAnswer || !Boolean(this.project.title);
    },
    addProfile: function() {
      this._createChild(this.project, 'profiles');
    },
    deleteProfile: function(profileId) {
      delete this.project.profiles[profileId];
    },
    addProfileInput: function(profileId) {
      var profile = this.project.profiles[profileId];
      this._createChild(profile, 'inputs');
    },
    deleteProfileInput: function(profileId, sensorId) {
      delete this.project.profiles[profileId].inputs[sensorId];
    },
    _createChild: function(containerParent, containerName) {
      if (typeof containerParent[containerName] !== 'object') {
        containerParent[containerName] = {};
      }
      var id = 0;
      for (var i in containerParent[containerName]) {
        id = Math.max(id, i + 1);
      }

      containerParent[containerName][id] = {id: id};
    }
  };

  $scope.$on('$destroy', function() {
    for (var i = 0; i < $scope.watches.length; i++) {
      $scope.watches[i]();
    }
    $scope.listsrv.destroy();
    $scope.createsrv.destroy();
  });
});
