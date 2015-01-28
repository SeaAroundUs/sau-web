'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('MainCtrl', ['$scope', '$http', 'leafletData', function ($scope, $http, leafletData) {

    leafletData.getMap('mainmap').then(function(map) {
      window.map = map;
    });

    angular.extend($scope, {

      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },
      defaults: {
        tileLayer: 'http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png',
        tileLayerOptions: {
          continuousWorld: false,
          noWrap: true,
          detectRetina: true, // no idea what this does
          reuseTiles: true // nor this
        },

      }
    });

    $scope.searchIP = function(ip) {
      var url = "http://freegeoip.net/json/" + ip;
      $http.get(url).success(function(res) {
        console.log(res);
        $scope.center = {
          lat: res.latitude,
          lng: res.longitude,
          zoom: 3
        }
        $scope.ip = res.ip;
        console.log(res);
      });
    };

    $scope.searchIP("");

    var templateDir = 'views/';
    $scope.templates = [
      {'name': 'Analyses and Visualization', 'url': templateDir+'data.html'},
      {'name': 'News', 'url': templateDir+'news.html'},
      {'name': 'Publications', 'url': templateDir+'publications.html'},
      {'name': 'People', 'url': templateDir+'people.html'},
      {'name': 'Collaborations', 'url': templateDir+'collaborations.html'},
      {'name': 'About Us', 'url': templateDir+'about.html'},
    ];
    $scope.template = $scope.templates[0];

    $scope.log = function(txt) {
      console.log(txt);
    };

    $scope.updateInclude = function(t) {
      $scope.template = t;
    };
  }]);