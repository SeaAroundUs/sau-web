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

    $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, feature, leafletEvent) {
        var layer = leafletEvent.target;
        layer.setStyle(highlightStyle);
        layer.bringToFront();
        $scope.hoverRegion = feature;
    });

    $scope.$on("leafletDirectiveMap.geojsonMouseout", function(ev, feature, leafletEvent) {
        $scope.hoverRegion = null;
    });

    $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
        regionClick(featureSelected, leafletEvent);
    });


    var highlightStyle = {
        fillColor: '#00f',
    };

    var defaultStyle = {
      color: 'black',
      stroke: true,
      weight: 1,
      opacity: 1.0,
      fillColor: 'black',
      fillOpacity: 0.3,
      lineCap: 'round'
    };

    var maxBounds = [
      [-89, -180],
      [89, 180]
    ];

    angular.extend($scope, {

      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },

      defaults: {
        maxBounds: maxBounds,
        tileLayer: 'http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png',
        tileLayerOptions: {
          noWrap: true,
          detectRetina: true, // no idea what this does
          reuseTiles: true // nor this
        },

      }
    });

    // get regions
    var url = 'http://localhost:8000/api/v1/eez/';
    $http.get(url)
      .success(function(data, status) {
        angular.extend($scope, {
          geojson: {
            data: data.data,
            style: defaultStyle,
            resetStyleOnMouseout: true
          }
        });
      });

    $scope.searchIP = function(ip) {
      var url = 'http://freegeoip.net/json/' + ip;
      $http.defaults.headers.common = {};
      $http.get(url).success(function(res) {
        $scope.center = {
          lat: res.latitude,
          lng: res.longitude,
          zoom: 3
        };
        $scope.ip = res.ip;
        console.log(res);
      });
    };

    // $scope.searchIP('');

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