/**
 * Created by Pratik on 8/5/2016.
 */

import loadGoogleMapsAPI from 'load-google-maps-api';

export default function ($scope, $http, $rootScope) {
    'ngInject';

    var map;
    var isMapLoaded = false;
    $scope.toShoworNot = false;
    $scope.markers = [];

    function showDetails(data) {
        $scope.toShoworNot = true;
        $scope.$apply(function () {
            $scope.marker = data;
        });
    }

    function addMarker(feature) {
        var marker = new window.mapObj.Marker({
            position: feature.position,
            map: map
        });

        var infowindow = new window.mapObj.InfoWindow({
            content: feature.title
        });

        marker.addListener('mouseover', function () {
            infowindow.open(map, marker);
        });

        marker.addListener('mouseout', function () {
            infowindow.close();
        });

        marker.addListener('click', function (event) {
            console.log('click', feature.data, event);
            showDetails(feature.data);
        });
    }

    function loadMap(cords) {
        map = new window.mapObj.Map(document.getElementById('map'), {
            zoom: 16,
            center: new window.mapObj.LatLng(cords.lat, cords.lon),
        });
    }

    function loadGoogle() {
        loadGoogleMapsAPI({key: 'AIzaSyAUhIqtIVo154vh0lg0dFIHh-h5MBjFgUE'}).then(function (Map) {
            window.mapObj = Map;
        }).catch(function (error) {
            console.error(error);
        });
    }

    $http.post('http://localhost:3000/getdata', $rootScope.data).then(function (data) {
        loadMap(data.data[0].cords);
        for (var i = 0; i < data.data.length; i++) {
            var business = data.data[i];

            var _marker = {
                position: new window.mapObj.LatLng(business.cords.lat, business.cords.lon),
                type: 'library',
                title: business.name,
                data: business
            };

            addMarker(_marker);
        }
    }, function (error) {
        console.error(error);
    });

    if (window.mapObj) {
        isMapLoaded = true;
    } else {
        loadGoogle();
    }

}