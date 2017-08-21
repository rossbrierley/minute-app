(function() {
    angular.module('fileManager')
        .controller('addMeetingCtrl', ['$scope', '$rootScope', 'dataServices', '$http',  '$state', function($scope, $rootScope, dataServices, $http, $state) {
            $scope.newMeeting = {};
            $scope.newMeeting.email = sessionStorage.email;
            $scope.newMeeting.name = sessionStorage.name;
            $scope.newMeeting.auth_token = sessionStorage.authToken;

            $scope.sendMeet = function() {
                var newMeet = $scope.newMeeting;
                console.log(newMeet);
                dataServices.doMeeting(newMeet).then(function (response) {
                    console.log(response);
                    console.log("Done");
                }, function (error){
                    console.log("Error");
                });
            };
        }]);
})();
