/**
 * Created by Pratik on 8/5/2016.
 */

export default function ($scope, $rootScope, $state) {
    'ngInject';

    $scope.query = null;
    $scope.location = null;

    function onPositionUpdate(position) {
        var lati = position.coords.latitude;
        var longi = position.coords.longitude;

        $scope.location = '' + lati + ', ' + longi;

        if($scope.query){
            sendData(true);
        }
    }

    $scope.nearme = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onPositionUpdate);
        }
        else {
            alert("navigator.geolocation is not available");
        }
    }

    $scope.search = function () {
        sendData(false);
    };

    function sendData(isCoordinates){
        $rootScope.data = {
            query: $scope.query,
            location: $scope.location,
            isCoordinates: isCoordinates
        };
        
        $state.go('results');
    }
}