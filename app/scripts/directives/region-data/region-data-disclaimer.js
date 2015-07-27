'use strict';

angular.module('sauWebApp')
  .directive('regionDataDisclaimer', function($compile, regionDataDisclaimerContent) {
    return {
      link: function(scope, ele) {
        var content = regionDataDisclaimerContent.getDisclaimer(scope.region.name);
        ele.append($compile('<span>' + content + '</span>')(scope));
      },
      restrict: 'E',
      replace: true,
      scope: { region: '=' },
      template: '<p class="disclaimer"></p>'
    };
  });
