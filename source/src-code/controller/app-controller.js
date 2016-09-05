/**
 * Created by Praitk on 02-09-2016.
 */

 import loadGoogleMapsAPI from 'load-google-maps-api';

 var markerImage = require('../../assets/images/marker.png');

 export default function () {
 	$('.search-bar').hover(function() {
 		$(this).find('.search-text').hide();
 		$(this).find('.show-item').show();
 		console.log($(this).find('.show-item').first());
 		$(this).find('.show-item').first().focus();
 	}, function() {
 		$(this).find('.show-item').hide();
 		$(this).find('.search-text').show();
 	});

 	$(".show-item").keyup(function (event) {
 		if (event.keyCode == 13) {
 			var textboxes = $(".show-item");
 			var currentBoxNumber = textboxes.index(this);
 			if (textboxes[currentBoxNumber + 1] != null) {
 				var nextBox = textboxes[currentBoxNumber + 1];
 				nextBox.focus();
 				nextBox.click();
 			}
 			event.preventDefault();
 			return false;
 		}
 	});

 	loadGoogleMapsAPI({key: 'AIzaSyAUhIqtIVo154vh0lg0dFIHh-h5MBjFgUE', timeout:5000}).then(function (Map) {
 		window.mapObj = Map;
 	}).catch(function (error) {
 		console.error(error);
 	});
 }