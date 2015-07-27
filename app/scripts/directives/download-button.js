'use strict';

angular.module('sauWebApp')
  .directive('downloadButton', function($modal) {
    return {
      link: function(scope) {
        scope.downloadModalGA = {
          category: 'DownloadModal',
          action: 'Open'
        };

        scope.openDownloadDataModal = function() {
          $modal.open({
            templateUrl: 'views/download-data-modal.html',
            controller: 'DownloadDataModalCtrl',
            resolve: {
              dataUrl: function() {
                return scope.downloadURL;
              }
            }
          });
        };

        scope.$on('setDownloadURL', function(event, url) { scope.downloadURL = url; });
      },
      restrict: 'E',
      scope: {},
      template: '<button ng-click="openDownloadDataModal()" ga-event="downloadModalGA" ' +
        'class="btn btn-primary download-button" ng-class="{ visible: downloadURL }">Download Data</button>'
    };
  });
