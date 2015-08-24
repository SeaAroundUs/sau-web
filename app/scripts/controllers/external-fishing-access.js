'use strict';

angular.module('sauWebApp')
  .controller('ExternalFishingAccessCtrl', function($scope, $location, $anchorScroll, agreements, region,
                                                    agreementAccessTypes, agreementTypes, fishingAccess) {
    /**
     * Fixes a bug with the Bootstrap-UI Dropdown component where the popup closes when you click inside of it.
     * See https://github.com/angular-ui/bootstrap/issues/3854
     * @param  {Object} event The click event
     * @return {null}
     */
    $scope.preventPopupAutoClose = function(event) {
      event.stopPropagation();
    };

    /**
     * An expression function that filters the agreements based on the fishing country filter (dropdown).
     * For an explanation of filtering ngRepeat-ed arrays, see https://docs.angularjs.org/api/ng/filter/filter
     * @param  {Any} agreement The agreement data item.
     * @return {Boolean} True if the agreement should be shown in the table. False otherwise.
     */
    $scope.filterAgreements = function (agreement) {
      return isAgreementVisible(agreement);
    };

    /**
     * Determines if an agreement should be visible, based on the checkbox data.
     * @param  {Object}  agreement Agreement data object
     * @return {Boolean}           Whether or not this agreement should be visible in the category's table.
     */
    function isAgreementVisible(agreement) {
      for (var i = 0; i < $scope.eezs.length; i++) {
        var country = $scope.eezs[i];
        if (country.name === agreement.eez_name) {
          return country.visible;
        }
      }
      return false;
    }

    /**
     * Show/hide all the EEZs from the agreement table.
     * @return {null}
     */
    $scope.setAllEEZsVisibility = function(eezs, visible) {
      for (var i = 0; i < eezs.length; i++) {
        eezs[i].visible = visible;
      }
    };

    /** @type {String} Used to display the name of this EEZ. */
    $scope.regionName = region.data.title;
    /** @type {Object} The API data about the agreements with this EEZ. */
    $scope.agreements = agreements.data;
    /** @type {Enum} See the requirements doc. */
    $scope.agreementAccessTypes = agreementAccessTypes;
    /** @type {Enum} See the requirements doc. */
    $scope.agreementTypes = agreementTypes;
    /** @type {Array} Alphabetical list of the EEZs that have an agreement with this fishing country. */
    $scope.eezs = fishingAccess.getEEZs($scope.agreements);
  });
