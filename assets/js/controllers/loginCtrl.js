(function() {
    angular.module('fileManager')
        .controller('loginCtrl', ['$scope', '$rootScope', 'dataServices', '$http',  '$state', '$mdToast', function($scope, $rootScope, dataServices, $http, $state, $mdToast) {
            $scope.user = {};
            sessionStorage.isLoggedIn = false;
            $scope.userLogin = function(user) {
                dataServices.doSignIn(user).then(function (response) {
                    if(response.data.success === true) {
                        $state.go('previousMeetings');
                        $mdToast.showSimple(response.data.msg);
                        sessionStorage.email = response.data.data[0].email;
                        sessionStorage.authToken = response.data.data[0].auth_token;
                        sessionStorage.name = response.data.data[0].name;
                        sessionStorage.isLoggedIn = true;

                        //console.log(response);
                    }
                    else{
                        console.log("else");
                        $mdToast.showSimple(response.data.msg);
                        sessionStorage.isLoggedIn = false;
                    }
                }, function (error){
                    $mdToast.showSimple(error.data.msg);
                });
            };
        }]);
})();
