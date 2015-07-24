'use strict';

angular.module('sauWebApp')
  .controller('InternalFishingAccessCtrl', function($scope, $location, $anchorScroll, agreements, region,
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
     * @param  {Any} value The agreement data item.
     * @return {Boolean} True if the agreement should be shown in the table. False otherwise.
     */
    $scope.filterPreAgreements = function (agreement) {
      return isAgreementVisible(agreement, 'pre');
    };
    $scope.filterPostAgreements = function (agreement) {
      return isAgreementVisible(agreement, 'post');
    };

    /**
     * Hides all the countries from the agreement table.
     * @return {null}
     */
    $scope.setAllCountriesVisibility = function(countries, visible) {
      for (var i = 0; i < countries.length; i++) {
        countries[i].visible = visible;
      }
    };

    /**
     * Determines if an agreement should be visible, based on the checkbox data.
     * @param  {Object}  agreement Agreement data object
     * @param  {string}  category  "pre" or "post"
     * @return {Boolean}           Whether or not this agreement should be visible in the category's table.
     */
    function isAgreementVisible(agreement, category) {
      for (var i = 0; i < $scope.fishingCountries[category].length; i++) {
        var country = $scope.fishingCountries[category][i];
        if (country.name === agreement.fishing_name) {
          return country.visible;
        }
      }
      return false;
    }

    /** @type {String} Used to display the name of this EEZ. */
    $scope.regionName = region.data.title;
    /** @type {Object} The API data about the agreements with this EEZ. */
    $scope.agreements = agreements.data;
    /** @type {Enum} See the requirements doc. */
    $scope.agreementAccessTypes = agreementAccessTypes;
    /** @type {Enum} See the requirements doc. */
    $scope.agreementTypes = agreementTypes;
    /** @type {Array} Alphabetical list of the countries that have an agreement with this EEZ. */
    $scope.fishingCountries = {
      pre: fishingAccess.getFishingCountries($scope.agreements.pre),
      post: fishingAccess.getFishingCountries($scope.agreements.post)
    };
  });
