(function() {
    angular.module('fileManager')
        .controller('addMeetingCtrl', ['$scope', '$rootScope', 'dataServices', '$http',  '$state', function($scope, $rootScope, dataServices, $http, $state) {
            $scope.newMeeting = {};
            $scope.newMeeting.email = sessionStorage.email;
            $scope.newMeeting.name = sessionStorage.name;
            $scope.newMeeting.auth_token = sessionStorage.authToken;

            var data = {
                "email" : sessionStorage.email,
                "auth_token": sessionStorage.authToken
            };
            dataServices.fetchCategory(data).then(function (response) {
                console.log(response);
                $scope.tags = response.data.data;
            });


            $scope.sendMeet = function(newMeeting) {
                var newMeet = newMeeting;
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
