/**
 * Created by Praitk on 02-09-2016.
 */

//import loadGoogleMapsAPI from 'load-google-maps-api';
import PS  from 'perfect-scrollbar';

var markerImage = require('../../assets/images/marker.png');

export default function ($scope, $http, $timeout, Notifier) {
	'ngInject';

	var mapView;

	var isSearching = false; //flag to know if search is pending

	var markers = [];

	$scope.results = [];

	var container = $('.search-list').get(0);
	PS.initialize(container, {
		wheelSpeed        : 2,
		wheelPropagation  : true,
		minScrollbarLength: 20
	});

	function initializeMap() {
		mapView = new window.google.maps.Map(document.getElementById('map-canvas'), {
			center           : {lat: 0, lng: 0},
			zoom             : 15,
			mapTypeId        : window.google.maps.MapTypeId.ROADMAP,
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

	function showFirstInput() {
		let toFocus = $('.show-item input').first();
		if (toFocus) {
			toFocus.focus();
		}
	}

	function getData(query, cb) {
		$http.post('/getdata', query, {timeout: 10000}).then(function (resp) {
			if (resp.data instanceof Array && resp.data.length > 0) {
				return cb(null, resp.data);
			} else if (resp.data instanceof Object && resp.data.error) {
				Notifier.notify('Error', 'Internal error,try again', 'error');
				showFirstInput();
				return cb(true);
			} else {
				Notifier.notify('No results', 'try with differnt query', 'error');
				showFirstInput();
				return cb(true);
			}
		}, function () {
			Notifier.notify('Unable to get results', 'try again', 'error');
			showFirstInput();
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
				delete marker.timeout;
			}
		} else {
			marker.setAnimation(window.google.maps.Animation.BOUNCE);
			marker.timeout = setTimeout(function () {
				marker.setAnimation(null);
			}, 3000);
		}
	}

	function scrollTo(index) {
		let top = $('.search-list .entry-' + index).get(0).offsetTop - 35; //added 35 for top padding
		$('.search-list').animate({
			scrollTop: top
		}, 1000);
		container.top = 0;
		PS.update(container);
	}

	function highlightEntry(index) {
		$('.highlighted').removeClass('highlighted');
		$('.entry-' + index).addClass('highlighted');
	}

	function addMarker(feature, timeout) {

		setTimeout(function () {
			let marker = new window.google.maps.Marker({
				position : feature.position,
				icon     : markerImage,
				animation: window.google.maps.Animation.DROP,
				map      : mapView
			});

			let infowindow = new window.google.maps.InfoWindow({
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
				scrollTo(timeout / 100);
				highlightEntry(timeout / 100);
			});

			markers.push(marker);
		}, timeout);

	}

	function setMarkers(result) {
		//empty marker stack
		setMapOnAll(null);
		markers        = [];
		$scope.results = [];

		//reset map center
		mapView.setCenter(new window.google.maps.LatLng(result[0].cords.lat, result[0].cords.lon));

		for (let i = result.length - 1; i > -1; i--) {
			let business   = result[i];
			business.class = i;

			let _marker = {
				position: new window.google.maps.LatLng(business.cords.lat, business.cords.lon),
				title   : business.name,
				data    : business
			};

			addMarker(_marker, i * 100);

			$timeout(function () {
				$scope.results.unshift(business);
			}, 100 * (result.length - (i + 1)));
		}
	}

	function inputListener() {
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

		$('.show-item button').on('click', search);
	}

	function resetSearchBar() {
		let searchBar = $('.search-bar');
		searchBar.remove();
		$('body').append(searchBar);

		setTimeout(inputListener, 100);
	}

	function search() {
		if (!mapView) {
			if (!window.google) {
				Notifier.notify('Loading content', 'please wait', 'warn');
				return;
			} else {
				initializeMap();
			}
		}

		let inputs = $('.show-item input');

		let query    = inputs.get(0).value.trim() || 'business',
		    location = inputs.get(1).value.trim();

		resetSearchBar();//reattach element to deal with sticky hover

		if (!location) {
			Notifier.notify('Invalid input', 'please provide location', 'warn');
			return;
		}

		if (location.length === 0) {
			Notifier.notify('Invalid input', 'please provide location', 'warn');
			return;
		}

		if (isSearching) {
			Notifier.notify('Please wait,', 'looking for results', 'info');
			return;
		} else {
			isSearching = true;
		}

		$('.back-layer').show();

		getData({query, location}, function (err, results) {
			isSearching = false;
			if (!err) {
				$('.back-layer').hide();
				$('.dummy-element').css({'height': ($('body').height() - 35) + 'px'});
				setMarkers(results);
			}
		});
	}

	$scope.showMarker = function (index) {
		if (markers[index]) {
			window.google.maps.event.trigger(markers[index], 'click', false);
			mapView.panTo(markers[index].position);
		}
	};

	if (window.google) {
		initializeMap();
	}

	inputListener();
}