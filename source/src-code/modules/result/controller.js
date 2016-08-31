/**
 * Created by Pratik on 8/5/2016.
 */

import loadGoogleMapsAPI from 'load-google-maps-api';

var markerImage = require('../../../assets/images/marker.png');

export default function ($scope, $http, $rootScope, $state) {
	'ngInject';

	var map;
	var isMapLoaded    = false;
	$scope.toShoworNot = false;
	$scope.markers     = [];

	function showDetails(data) {
		$scope.toShoworNot = true;
		$scope.$apply(function () {
			$scope.marker = data;
		});
	}

	function goBack(msg) {
		if (window.alert) {
			var display = msg || 'looks we have an error!,please try later';
			alert(display);
		}

		setTimeout(function () {
			$state.go('home');
		});
	}

	function addMarker(feature) {
		var marker = new window.mapObj.Marker({
			position: feature.position,
			icon    : markerImage,
			map     : map
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
			showDetails(feature.data);
		});
	}

	function loadMap(cords) {
		map = new window.mapObj.Map(document.getElementById('map'), {
			zoom  : 16,
			center: new window.mapObj.LatLng(cords.lat, cords.lon)
		});
	}

	function loadGoogle() {
		loadGoogleMapsAPI({key: 'AIzaSyAUhIqtIVo154vh0lg0dFIHh-h5MBjFgUE'}).then(function (Map) {
			window.mapObj = Map;
		}).catch(function (error) {
			console.error(error);
		});
	}

	$http.post('/getdata', $rootScope.data).then(function (resp) {
		if (resp.data instanceof Array && resp.data.length > 0) {
			loadMap(resp.data[0].cords);
			for (var i = 0; i < resp.data.length; i++) {
				var business = resp.data[i];

				var _marker = {
					position: new window.mapObj.LatLng(business.cords.lat, business.cords.lon),
					title   : business.name,
					data    : business
				};

				addMarker(_marker);
			}
		} else {
			goBack('No Results found');
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