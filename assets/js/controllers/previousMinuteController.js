(function() {
    angular.module('fileManager')
        .controller('previousMinuteController', ['$scope', '$rootScope', 'dataServices', '$http',  '$state','$mdDialog', function($scope, $rootScope, dataServices, $http, $state,$mdDialog) {
            console.log('previousMinuteController');
           $rootScope.meetings = [];

                var data = {
                    "email" : sessionStorage.email,
                    "auth_token": sessionStorage.authToken
                };
                console.log(sessionStorage);

            $scope.hideIt = true;
            $scope.downloadPDF = function () {
                var doc = new jsPDF();
                var specialElementHandlers = {
                    '#hide': function (element, renderer) {
                        return true;
                    }
                };
                doc.fromHTML(document.getElementById('pdf'), 15, 15, {
                    'width': 170,
                    'elementHandlers': specialElementHandlers
                });
                doc.save('minute.pdf');

            }
              dataServices.fetchMinutes(data).then(function (response) {

                  console.log(response.data.msg);
                  $rootScope.meeting = response.data.data;
                  for(var i = 0; i<$rootScope.meeting.length; i++)
                  {
                      $rootScope.meetings.push($rootScope.meeting[i]);
                  }
                  console.log($rootScope.meetings);
              });
            $rootScope.view = function (meeting) {

                console.log(meeting);
                $rootScope.thisMeet  = meeting;

                $state.go('viewMinute');

            };

            $rootScope.addMinute = function (ev) {
                $mdDialog.show({
                    controller: addController,
                    templateUrl: 'views/addMinute-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };
            function addController($scope,$mdDialog, $rootScope) {
                console.log($rootScope.index);
                $scope.submit = function () {
                   console.log($rootScope.meetings);
                    var newMeet = {};
                    newMeet._id =$rootScope.thisMeet._id;
                    newMeet.meetingName =$rootScope.thisMeet.meeting_name;
                    newMeet.email = sessionStorage.email;
                    newMeet.minute = $scope.description;
                    console.log(newMeet);
                    dataServices.doMeeting(newMeet).then(function (response) {
                        console.log(response);
                        $rootScope.thisMeet.minutes.push(newMeet);
                        $rootScope.thisMeet.minutes[$rootScope.thisMeet.minutes.length - 1].bullet_points =  $scope.description;
                    }, function (error){
                        console.log("Error");
                    });
                    $mdDialog.hide();
                };
            }
            $scope.edit = function(index,ev) {
                $rootScope.ind = index;
                $mdDialog.show({
                    controller: editController,
                    templateUrl: 'views/edit-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })

                function editController($scope,$mdDialog) {
                    $scope.submit = function () {
                        var editData = {};
                        editData.auth_token = sessionStorage.authToken;
                        editData.description = $scope.description;
                        editData.email = sessionStorage.email;
                        editData.meetingName = $rootScope.thisMeet.meeting_name;
                        editData.minute = $rootScope.thisMeet.minutes[$rootScope.ind].bullet_points;
                        editData.name = sessionStorage.name;
                        editData.tag = $rootScope.thisMeet.tag;
                        dataServices.doEdit(editData).then(function (response) {
                            alert(response.data.msg);
                            $rootScope.thisMeet.minutes[$rootScope.ind].bullet_points = $scope.description;

                        },function (error) {
                            console.log(error);
                        })
                        $mdDialog.hide();
                    };
                }
            };

        }]);
})();
