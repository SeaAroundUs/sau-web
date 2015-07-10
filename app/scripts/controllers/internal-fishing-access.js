'use strict';

angular.module('sauWebApp')
  .controller('InternalFishingAccessCtrl', function($scope, $location, $anchorScroll, agreements, region, agreementAccessTypes, agreementFishingAccessTypes, agreementTypes, fishingAccess) {
    /**
     * Uses the Angular way of scrolling the screen to the specified ID tag on the page.
     * See http://stackoverflow.com/questions/14712223/how-to-handle-anchor-hash-linking-in-angularjs
     * @param  {String} anchorName The ID of the tag you want to scroll to
     * @return {null}
     */
    $scope.goToAnchor = function(anchorName) {
      $location.hash(anchorName);
      $anchorScroll();
    };

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
    $scope.hideFishingCountries = function (agreement) {
      return $scope.filterFishingCountries[$scope.fishingCountries.indexOf(agreement.fishing_name)];
    };

    /**
     * Hides all the countries from the agreement table.
     * @return {null}
     */
    $scope.hideAllCountries = function() {
      for (var i = 0; i < $scope.filterFishingCountries.length; i++) {
        $scope.filterFishingCountries[i] = false;
      }
    };

    /**
     * Shows all countries on the agreement table.
     * @return {null}
     */
    $scope.showAllCountries = function() {
      for (var i = 0; i < $scope.filterFishingCountries.length; i++) {
        $scope.filterFishingCountries[i] = true;
      }
    };

    /** @type {String} Used to display the name of this EEZ. */
    $scope.regionName = region.data.title;
    /** @type {Object} The API data about the agreements with this EEZ. */
    $scope.agreements = agreements.data;
    /** @type {Enum} See the requirements doc. */
    $scope.agreementAccessTypes = agreementAccessTypes;
    /** @type {Enum} See the requirements doc. */
    $scope.agreementFishingAccessTypes = agreementFishingAccessTypes;
    /** @type {Enum} See the requirements doc. */
    $scope.agreementTypes = agreementTypes;
    /** @type {Array} Alphabetical list of the countries that have an agreement with this EEZ. */
    $scope.fishingCountries = fishingAccess.getFishingCountries(agreements);
    /** @type {Array} A boolean value mapping to the fishingCountries array, which represents that country's visibility in the table. */
    $scope.filterFishingCountries = [];
    for (var i = 0; i < $scope.fishingCountries.length; i++) {
      $scope.filterFishingCountries[i] = true;
    }
  });
