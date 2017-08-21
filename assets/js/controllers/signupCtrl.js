(function() {
    angular.module('fileManager')
        .controller('signupCtrl', ['$scope', '$rootScope', 'dataServices', '$http',  '$state','$mdToast', function($scope, $rootScope, dataServices, $http, $state, $mdToast) {
            $scope.newUser = {};
            $scope.newUserSignup = function(newUser) {
                dataServices.doSignUp(newUser).then(function (response) {
                    $mdToast.showSimple(response.data.msg);
                }, function (error){
                    console.log("Error");
                });
            };
        }]);
})();
