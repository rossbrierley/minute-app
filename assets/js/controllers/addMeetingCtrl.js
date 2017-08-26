(function() {
    angular.module('fileManager')
        .controller('addMeetingCtrl', ['$scope', '$rootScope', 'dataServices', '$http',  '$state', '$mdToast','$cookies', function($scope, $rootScope, dataServices, $http, $state, $mdToast, $cookies) {
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
            dataServices.fetchPresent(data).then(function (response) {
                console.log(response);
                $rootScope.presents = response.data.data;
            });

            var faculties = [];

            $scope.thisFaculty = '';
            $scope.addFaculty = function (faculty) {
                if(faculty !== undefined){
                    faculties.push(faculty);
                    $scope.newMeeting.presents = faculties.toString();
                    $scope.thisFaculty = '';
                }

            }

            $scope.sendMeet = function(newMeeting) {
                var newMeet = newMeeting;
                newMeet.codeID = newMeeting.tag.code;
                console.log(newMeet);
                dataServices.doMeeting(newMeet).then(function (response) {
                    if(response.data.success === true) {
                        $mdToast.showSimple(response.data.msg);
                        var data = response.data.data;
                        $rootScope.count = response.data.data.count;
                        var tag = response.data.data.tag;
                        $cookies.putObject('tag',tag);
                        console.log($cookies.getObject('tag'));
                        sessionStorage.count = response.data.data.count;
                        console.log(sessionStorage.count);
                        $rootScope.view(data);

                    }
                    else{
                        $mdToast.showSimple(response.data.msg);
                    }
                    console.log(response);
                    console.log("Done");

                }, function (error){
                    console.log("Error");
                });
            };
            $rootScope.view = function (meeting) {

                console.log(meeting);
                $rootScope.thisMeet  = meeting;
                $state.go('viewMinute');

            };
        }]);
})();
