(function() {
    angular.module('fileManager')
        .controller('viewMinuteCtrl', ['$scope', '$rootScope', 'dataServices', '$http',  '$state','$mdDialog', function($scope, $rootScope, dataServices, $http, $state, $mdDialog) {
            console.log('viewMinuteController');

            $scope.edit = function(ev) {
                $mdDialog.show({
                    controller: editController,
                    templateUrl: 'views/edit-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })

                function editController($scope,$mdDialog) {
                    $scope.submit = function () {
                        $mdDialog.hide();
                    };
                }
            };

            $scope.addMinute = function (ev) {
                $mdDialog.show({
                    controller: addController,
                    templateUrl: 'views/addMinute-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })

                function addController($scope,$mdDialog) {
                    $scope.submit = function () {
                        $mdDialog.hide();
                    };
                }
            };


        }]);
})();
