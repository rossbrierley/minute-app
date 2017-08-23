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
            dataServices.fetchPresent(data).then(function (response) {
                console.log(response);
                $rootScope.presents = response.data.data;
            });

             var faculties = [];
             function makeString(array) {
                 var list = ''
                 for(var i = 0; i < array.length; i++){

                     var list = array[i] + ' , ' +  list ;
                 }
                 return list;
             }
            $scope.thisFaculty = '';
            $scope.addFaculty = function (faculty) {
                if(faculty !== undefined){
                     faculties.push(faculty);
                     $scope.newMeeting.presents = makeString(faculties);
                     $scope.thisFaculty = '';
                }

            }

            $scope.sendMeet = function(newMeeting) {
                var newMeet = newMeeting;
                console.log(newMeet);
                dataServices.doMeeting(newMeet).then(function (response) {
                    if(response.data.success === true) {
                        console.log("signup is success");
                        $state.go('previousMeetings');
                        $mdToast.showSimple(response.data.msg);
                    }
                    else {
                        console.log("signup not success");
                        $mdToast.showSimple(response.data.msg);
                    }
                    console.log(response);
                    console.log("Done");

                }, function (error){
                    console.log("Error");
                });
            };
        }]);
})();
