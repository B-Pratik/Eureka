/**
 * Created by Praitk on 02-09-2016.
 */

 import loadGoogleMapsAPI from 'load-google-maps-api';

 var markerImage = require('../../assets/images/marker.png');

 export default function () {
 	loadGoogleMapsAPI({key: 'AIzaSyAUhIqtIVo154vh0lg0dFIHh-h5MBjFgUE', timeout:5000}).then(function (Map) {
 		window.mapObj = Map;
 	}).catch(function (error) {
 		console.error(error);
 	});
 }