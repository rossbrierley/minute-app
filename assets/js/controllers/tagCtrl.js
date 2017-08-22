(function() {
    angular.module('fileManager')
        .controller('tagCtrl', ['$scope', '$rootScope', 'dataServices', '$http',  '$state','$mdDialog', function($scope, $rootScope, dataServices, $http, $state,$mdDialog) {
            console.log('tagCtrl');


            var data = {
                "email" : sessionStorage.email,
                "auth_token": sessionStorage.authToken
            };
            dataServices.fetchCategory(data).then(function (response) {
                console.log(response);
                $rootScope.tags = response.data.data;
            });

            $rootScope.addtag = function (ev) {
                $mdDialog.show({
                    controller: addController,
                    templateUrl: 'views/tag-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };
            function addController($scope,$mdDialog, $rootScope) {
                $scope.submit = function (tag) {

                    dataServices.doTag(tag).then(function (response) {
                        var lastTag = {
                            group_name : tag.group,
                            code : tag.code
                        }
                        $rootScope.tags.push(lastTag);
                    }, function (error){
                        console.log("Error");
                    });
                    $mdDialog.hide();
                };
            }


        }]);
})();
