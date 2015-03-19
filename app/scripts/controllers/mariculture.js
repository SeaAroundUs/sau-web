;(function() {

  /* global L */

  'use strict';

  angular.module('sauWebApp').controller('MaricultureCtrl', function($scope, $resource, mapConfig, sauAPI, leafletData, leafletBoundsHelpers, openModal) {

    $scope.region = {name: 'mariculture'};

    angular.extend($scope, {
      center: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      },
      maxbounds: leafletBoundsHelpers.createBoundsFromArray([[-89, -200],[89, 200]])
    });

    leafletData.getMap('mainmap').then(function(map) {
      $scope.map = map;
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
    });

    $scope.selected = function(feature) {
      console.log(feature);
      var region_id = feature.c_number;
      openModal.open(region_id, $scope);
    };

    // these functions are required to exist by
    // minimap. Fake it 'till you make it.
    $scope.geojsonClick = function() {};
    $scope.geojsonMouseout = function() {};
    $scope.geojsonMouseover = function() {};

    $scope.features = $resource('bower_components/geo-boundaries-world-110m/countries.geojson', {}, {get: {method: 'GET', cache: true}})
      .get();
    $scope.features.$promise.then(function(data) {
        var filteredData = data.features.filter(function(f) {
                    if($scope.un_mapping[f.properties.iso_a3]){
                      return true;
                    } else {
                      return false;
                    }
        });
        // $scope.features.data = filteredData;
        angular.extend($scope, {
          features: {
            data: filteredData
          },
          geojson: {
            data: filteredData,
            style: mapConfig.countryStyle,
            onEachFeature: function(feature, layer) {
              layer.feature.properties.c_number = $scope.un_mapping[layer.feature.properties.iso_a3].c_number;
              layer.on({
                click: function() {
                  $scope.selected(layer.feature.properties);
                },
                mouseover: function() {
                  layer.setStyle(mapConfig.selectedStyle);
                },
                mouseout: function() {
                  layer.setStyle(mapConfig.countryStyle);
                }
              });
            }
          }
        });
      });

    // temporary mapping until we get country data in the DB
    // source: select to_json(array_agg(t))
    // FROM  (select DISTINCT m.c_number, c.english_name, c.un_name from legacy_country c
    // JOIN mariculture m
    // USING(c_number) ORDER BY un_name) t;
    $scope.un_mapping = JSON.parse('{"RUS": {"english_name": "Russian Federation", "c_number": 643}, "MEX": {"english_name": "Mexico", "c_number": 484}, "VNM": {"english_name": "Viet Nam", "c_number": 704}, "DEU": {"english_name": "Germany, Fed. Rep.", "c_number": 276}, "NGA": {"english_name": "Nigeria", "c_number": 566}, "KWT": {"english_name": "Kuwait", "c_number": 414}, "ISR": {"english_name": "Israel", "c_number": 376}, "BHR": {"english_name": "Bahrain", "c_number": 48}, "MMR": {"english_name": "Myanmar", "c_number": 104}, "GUY": {"english_name": "Guyana", "c_number": 328}, "GBR": {"english_name": "United Kingdom", "c_number": 826}, "CUB": {"english_name": "Cuba", "c_number": 192}, "IDN": {"english_name": "Indonesia", "c_number": 360}, "BLZ": {"english_name": "Belize", "c_number": 84}, "GTM": {"english_name": "Guatemala", "c_number": 320}, "ARG": {"english_name": "Argentina", "c_number": 32}, "ALB": {"english_name": "Albania", "c_number": 8}, "JPN": {"english_name": "Japan (main islands)", "c_number": 392}, "FJI": {"english_name": "Fiji", "c_number": 242}, "BGR": {"english_name": "Bulgaria", "c_number": 100}, "NOR": {"english_name": "Norway", "c_number": 578}, "PAK": {"english_name": "Pakistan", "c_number": 586}, "TUN": {"english_name": "Tunisia", "c_number": 788}, "SVN": {"english_name": "Slovenia", "c_number": 705}, "CYP": {"english_name": "Cyprus", "c_number": 196}, "LBN": {"english_name": "Lebanon", "c_number": 422}, "SYC": {"english_name": "Seychelles", "c_number": 690}, "VUT": {"english_name": "Vanuatu", "c_number": 548}, "MUS": {"english_name": "Mauritius", "c_number": 480}, "PYF": {"english_name": "Fr Polynesia", "c_number": 258}, "CHN": {"english_name": "China", "c_number": 156}, "SGP": {"english_name": "Singapore", "c_number": 702}, "SAU": {"english_name": "Saudi Arabia", "c_number": 682}, "ISL": {"english_name": "Iceland", "c_number": 352}, "PAN": {"english_name": "Panama", "c_number": 591}, "FIN": {"english_name": "Finland", "c_number": 246}, "NZL": {"english_name": "New Zealand", "c_number": 554}, "GUM": {"english_name": "Guam", "c_number": 316}, "PRK": {"english_name": "Korea, D.P.R. of", "c_number": 408}, "DNK": {"english_name": "Denmark", "c_number": 208}, "SUR": {"english_name": "Suriname", "c_number": 740}, "ANT": {"english_name": "Netherlands Antilles", "c_number": 532}, "HRV": {"english_name": "Croatia", "c_number": 191}, "MYT": {"english_name": "Mayotte", "c_number": 175}, "ERI": {"english_name": "Eritrea", "c_number": 111}, "NLD": {"english_name": "Netherlands", "c_number": 528}, "SEN": {"english_name": "Senegal", "c_number": 686}, "YUG": {"english_name": "Montenegro", "c_number": 891}, "CHA": {"english_name": "Channel Islands", "c_number": 830}, "MDG": {"english_name": "Madagascar", "c_number": 450}, "MOZ": {"english_name": "Mozambique", "c_number": 508}, "OMN": {"english_name": "Oman", "c_number": 512}, "CRI": {"english_name": "Costa Rica", "c_number": 188}, "DOM": {"english_name": "Dominican Republic", "c_number": 214}, "TWN": {"english_name": "Taiwan", "c_number": 157}, "CHL": {"english_name": "Chile", "c_number": 152}, "TMP": {"english_name": "Timor Leste", "c_number": 626}, "EGY": {"english_name": "Egypt", "c_number": 818}, "COL": {"english_name": "Colombia", "c_number": 170}, "REU": {"english_name": "R\u00e9union", "c_number": 638}, "MYS": {"english_name": "Malaysia", "c_number": 458}, "ESP": {"english_name": "Spain", "c_number": 724}, "GRC": {"english_name": "Greece", "c_number": 300}, "BHS": {"english_name": "Bahamas", "c_number": 44}, "ZAF": {"english_name": "South Africa", "c_number": 710}, "CAN": {"english_name": "Canada", "c_number": 124}, "FRA": {"english_name": "France", "c_number": 250}, "DZA": {"english_name": "Algeria", "c_number": 12}, "QAT": {"english_name": "Qatar", "c_number": 634}, "FRO": {"english_name": "Faeroe Islands", "c_number": 234}, "HKG": {"english_name": "Hong Kong", "c_number": 344}, "PRI": {"english_name": "Puerto Rico", "c_number": 630}, "PER": {"english_name": "Peru", "c_number": 604}, "NIC": {"english_name": "Nicaragua", "c_number": 558}, "AUS": {"english_name": "Australia", "c_number": 36}, "SLV": {"english_name": "El Salvador", "c_number": 222}, "JAM": {"english_name": "Jamaica", "c_number": 388}, "HND": {"english_name": "Honduras", "c_number": 340}, "TUR": {"english_name": "Turkey", "c_number": 792}, "KHM": {"english_name": "Cambodia", "c_number": 116}, "KEN": {"english_name": "Kenya", "c_number": 404}, "YEM": {"english_name": "Yemen", "c_number": 887}, "ARE": {"english_name": "United Arab Emirates", "c_number": 784}, "MAR": {"english_name": "Morocco", "c_number": 504}, "BRA": {"english_name": "Brazil", "c_number": 76}, "TCA": {"english_name": "Turks and Caicos Is.", "c_number": 796}, "ECU": {"english_name": "Ecuador", "c_number": 218}, "PRT": {"english_name": "Portugal", "c_number": 620}, "VEN": {"english_name": "Venezuela", "c_number": 862}, "SWE": {"english_name": "Sweden", "c_number": 752}, "THA": {"english_name": "Thailand", "c_number": 764}, "LKA": {"english_name": "Sri Lanka", "c_number": 144}, "BGD": {"english_name": "Bangladesh", "c_number": 50}, "MTQ": {"english_name": "Martinique", "c_number": 474}, "MAC": {"english_name": "Macau", "c_number": 446}, "KOR": {"english_name": "Korea, R. of", "c_number": 410}, "UKR": {"english_name": "Ukraine", "c_number": 804}, "PNG": {"english_name": "Papua New Guinea", "c_number": 598}, "NAM": {"english_name": "Namibia", "c_number": 516}, "USA": {"english_name": "USA (contiguous states)", "c_number": 840}, "MLT": {"english_name": "Malta", "c_number": 470}, "TUV": {"english_name": "Tuvalu", "c_number": 798}, "ITA": {"english_name": "Italy", "c_number": 380}, "COK": {"english_name": "Cook Islands", "c_number": 184}, "BIH": {"english_name": "Bosnia and Herzegovina", "c_number": 70}, "IND": {"english_name": "India", "c_number": 356}, "FLK": {"english_name": "Falkland Is. (Malvinas)", "c_number": 238}, "PHL": {"english_name": "Philippines", "c_number": 608}, "IRL": {"english_name": "Ireland", "c_number": 372}, "BRN": {"english_name": "Brunei Darussalam", "c_number": 96}, "IRN": {"english_name": "Iran, Islamic R. of", "c_number": 364}, "LBY": {"english_name": "Libyan Arab Jamahiriya", "c_number": 434}, "NCL": {"english_name": "New Caledonia", "c_number": 540}}');
  });
})();