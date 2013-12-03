/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('CreateCtrl', function($scope, ProjectList, ProjectCreate) {
    $scope.view = {
	formOpen : false,
	openProjectForm : function(projectId) {
	    if (projectId && $scope.projects[projectId]) {
		$scope.editingProject.title = $scope.projects[projectId].title;
		$scope.editingProject.description = $scope.projects[projectId].description;
		$scope.editingProject.is_public = $scope.projects[projectId].is_public;
		$scope.editingProject.id = projectId;
	    } else {
		this._reset();
	    }
	    this.createOpen = true;
	},
	closeProjectForm : function() {
	    this._reset();
	    this.createOpen = false;
	},
	_reset : function() {
	    $scope.editingProject.title = $scope.editingProject.description = "";
	    $scope.editingProject.id = null;
	    $scope.editingProject.is_public = false;
	}
    };

    $scope.awaitingDataAnswer = false;

    $scope.listsrv = ProjectList.getList('owned');
    $scope.projects = {};

    $scope.createsrv = ProjectCreate.create($scope.listsrv);

    $scope.watches = [ $scope.$watch('listsrv.projects', function() {
	$scope.projects = $scope.listsrv.projects;
    }), $scope.$watch('createsrv.working', function() {
	if ($scope.awaitingDataAnswer && !$scope.createsrv.working) {
	    $scope.view.closeProjectForm();
	}

	$scope.awaitingDataAnswer = $scope.createsrv.working;
    }) ];

    $scope.editingProject = {
	id : null,
	title : "",
	description : "",
	is_public : false,
	isNew : function() {
	    return this.id === null;
	},
	save : function() {
	    $scope.createsrv.submit(this.id, this.title, this.description, this.is_public);
	},
	okButtonDisabled : function() {
	    return $scope.awaitingDataAnswer || this.title.length === 0;
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
