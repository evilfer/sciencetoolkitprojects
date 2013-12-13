/*global angular*/

var myApp = angular.module('myApp');

myApp.controller('UploadDataCtrl', function($scope, SyncService, ProjectIdService, $stateParams, $fileUploader) {
  $scope.request = ProjectIdService.check($stateParams);

  $scope.watchers = new nspWatchers();

  $scope.syncService = SyncService;

  if ($scope.request.projectId) {
    $scope.project = null;
    $scope.ready = false;

    $scope.watchers.watch($scope, 'syncService.data', function() {
      if ($scope.syncService.data.project) {
        $scope.project = $scope.syncService.data.project;
        $scope.profile = $scope.project.profiles[$stateParams.profileId];
        $scope.bad = false;
        $scope.ready = true;


        var uploader = $scope.uploader = $fileUploader.create({
          scope: $scope, // to automatically update the html. Default: $rootScope
          formData: [
            {projectid: $scope.project.id,
              profileid: $scope.profile.id
            }
          ],
          url: '/api/upload'
        });


        uploader.bind('afteraddingfile', function(event, item) {
          console.info('After adding a file', item);
        });

        uploader.bind('afteraddingall', function(event, items) {
          console.info('After adding all files', items);
        });

        uploader.bind('changedqueue', function(event, items) {
          console.info('Changed queue', items);
        });

        uploader.bind('beforeupload', function(event, item) {
          console.info('Before upload', item);
        });

        uploader.bind('progress', function(event, item, progress) {
          console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function(event, xhr, item, response) {
          console.info('Success', xhr, item, response);
        });

        uploader.bind('error', function(event, xhr, item, response) {
          console.info('Error', xhr, item, response);
        });

        uploader.bind('complete', function(event, xhr, item, response) {
          console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function(event, progress) {
          console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function(event, items) {
          console.info('All files are transferred', items);
        });


        $scope.actions = {
          hasUploaded: function() {
            for (var i = uploader.queue.length - 1; i >= 0; i--) {
              if (uploader.queue[i].isSuccess) {
                return true;
              }
            }
            return false;
          },
          clearUploaded: function() {
            for (var i = uploader.queue.length - 1; i >= 0; i--) {
              if (uploader.queue[i].isSuccess) {
                uploader.queue[i].remove();
              }
            }
          }
        };
      }
    });





    $scope.syncService.getProject($scope.request.projectId, false, false, false);
  } else {
    $scope.project = null;
    $scope.bad = true;
    $scope.ready = true;
  }

  $scope.$on('$destroy', function() {
    $scope.syncService.stop();
    $scope.watchers.unwatch();
  });






});

