'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.advSearchService
 * @description
 * # advSearchService
 * This service helps the advanced search controller and its child controller (with specific query ui) to communicate.
 * Using a service to facilitate communication between a parent and child scope is the preferred way, rather than
 * having the child access the parent controller's model via $parent or inherited scope properties.
 * Both controllers depend on the service, and it makes

 * http://www.quora.com/What-is-the-best-way-to-communicate-between-nested-controllers-in-AngularJS
 */
angular.module('sauWebApp')
  .factory('advSearchService', function () {

    var advSearchService = {
      state: {
        isQueryGraphable: false,
        isQueryDownloadable: false,
        graphPageUrl: '',
        downloadDataUrl: '',
        searchOn: ''
      }
    };

    return advSearchService;
  });
