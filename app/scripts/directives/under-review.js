(function(angular) {
  'use strict';

  angular.module('sauWebApp').directive('underReview',
    function(sauAPI) {
      var message = '<p class="under-review">** Data under review</p>';
      var underReviewPromise = sauAPI.UnderReview.get().$promise;

      return {
        link: function(scope, ele) {
          scope.$watch('eez', function() {
            var ids = [].concat(scope.eez);

            underReviewPromise.then(function(res) {
              var markedIds = ids.filter(function(id) {
                return res.data.indexOf(id) !== -1;
              });

              if (markedIds.length > 0) {
                ele.html(message);
              } else {
                ele.html('');
              }
            });
          });
        },
        restrict: 'E',
        scope: { eez: '=' }
      };
    }
  );
})(angular);
