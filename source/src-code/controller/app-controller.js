/**
 * Created by Praitk on 02-09-2016.
 */

import loadGoogleMapsAPI from 'load-google-maps-api';

var markerImage = require('../../assets/images/marker.png');

export default function ($scope, $http) {
	'ngInject';

	var GoogleMap, mapView;

	var markers = [];

	function initializeMap() {
		mapView = new GoogleMap.Map(document.getElementById('map-canvas'), {
			center           : {lat: 0, lng: 0},
			zoom             : 15,
			mapTypeId        : GoogleMap.MapTypeId.ROADMAP,
			styles           : [{
				featureType: 'poi.business',
				elementType: 'labels',
				stylers    : [
					{visibility: 'off'}
				]
			}],
			zoomControl      : true,
			scaleControl     : true,
			streetViewControl: false,
			mapTypeControl   : false
		});
	}

	function getData(query, cb) {
		$http.post('/getdata', query).then(function (resp) {
			if (resp.data instanceof Array && resp.data.length > 0) {
				return cb(null, resp.data);
			} else {
				return cb(true);
			}
		}, function (error) {
			console.error(error);
			return cb(true);
		});
	}

	function setMapOnAll(map) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	}

	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
			if (marker.timeout) {
				clearTimeout(marker.timeout);
			}
		} else {
			marker.setAnimation(GoogleMap.Animation.BOUNCE);
			marker.timeout = setTimeout(function () {
				marker.setAnimation(null);
			}, 3000);
		}
	}

	function addMarker(feature, timeout) {

		setTimeout(function () {
			let marker = new GoogleMap.Marker({
				position : feature.position,
				icon     : markerImage,
				animation: GoogleMap.Animation.DROP,
				map      : mapView
			});

			let infowindow = new GoogleMap.InfoWindow({
				content: feature.title
			});

			marker.addListener('mouseover', function () {
				infowindow.open(mapView, marker);
			});

			marker.addListener('mouseout', function () {
				infowindow.close();
			});

			marker.addListener('click', function () {
				toggleBounce(marker);
			});

			markers.push(marker);
		}, timeout);

	}

	function setMarkers(result) {
		//empty marker stack
		setMapOnAll(null);
		markers = [];

		//reset map center
		mapView.setCenter(new GoogleMap.LatLng(result[0].cords.lat, result[0].cords.lon));

		for (var i = 0; i < result.length; i++) {
			var business = result[i];

			var _marker = {
				position: new GoogleMap.LatLng(business.cords.lat, business.cords.lon),
				title   : business.name,
				data    : business
			};

			addMarker(_marker, i * 100);
		}
	}

	loadGoogleMapsAPI({key: 'AIzaSyAUhIqtIVo154vh0lg0dFIHh-h5MBjFgUE', timeout: 5000}).then(function (mapInstance) {
		GoogleMap = mapInstance;
		initializeMap();
	}).catch(function (error) {
		console.error(error);
	});

	$scope.search = function () {
		getData({query: 'beer', location: 'new york'}, function (err, results) {
			if (err) {
				console.error(err);
			} else {
				$('.back-layer').hide();
				setMarkers(results);
			}
		});
	};

	$('.search-bar').hover(function () {
		$(this).find('.search-text').hide();
		$(this).find('.show-item').show();
		$(this).find('.show-item').first().children().focus();
	}, function () {
		$(this).find('.show-item').hide();
		$(this).find('.search-text').show();
	});

	$('.show-item').keyup(function (event) {
		if (event.keyCode === 13) {
			var textboxes        = $('.show-item');
			var currentBoxNumber = textboxes.index(this);

			if (textboxes[currentBoxNumber + 1] !== null) {
				var nextBox = $(textboxes[currentBoxNumber + 1]).children();
				nextBox.focus();
				nextBox.click();
			}

			event.preventDefault();
			return false;
		}
	});
}