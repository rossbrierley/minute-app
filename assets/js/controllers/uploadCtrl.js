(function(){
	angular.module('fileManager')
		   .controller('uploadCtrl',['$scope', '$rootScope', 'dataServices', '$http',  '$state','$mdDialog','Upload','$mdToast',function($scope, $rootScope, dataServices, $http, $state,$mdDialog, Upload) {
			//var storageRef = firebase.storage().ref();
			// var userRef = storageRef.child(userFolder.uid);



               var data = {
                   "email" : sessionStorage.email,
                   "auth_token": sessionStorage.authToken
               };
              dataServices.fetchCategory(data).then(function (response) {
                   console.log(response);
                   $rootScope.tags = response.data.data;
               });
               $rootScope.uploadfiles = function (ev) {
                   $mdDialog.show({
                       controller: addController,
                       templateUrl: 'views/uploadFiles-dialog.html',
                       parent: angular.element(document.body),
                       targetEvent: ev,
                       clickOutsideToClose: true
                   });
               };
               function addController($scope,$mdDialog, $rootScope, $mdToast) {
                   $scope.disableFeild = true;
                   $scope.tags = $rootScope.tags;
                   $scope.datas = {};
                   $scope.datas.email = sessionStorage.email;
                   $scope.datas.auth_token = sessionStorage.authToken;
                       $scope.submit = function (file, datas) {
                           Upload.upload({
                               url: '/upload/add',
                               arrayKey: '',
                               data: {file: file, datas: datas},


                           }).then(function (resp) {
                               $mdToast.show($mdToast.simple().textContent(resp.data.msg));
                               console.log('Success ' + resp.data + 'uploaded. Response: ' + resp.fal);
                           }, function (resp) {
                               $mdToast.show($mdToast.simple().textContent(resp.data.msg));
                               console.log('Error status: ' + resp.status);
                           }, function (evt) {
                               $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                               console.log('progress: ' + $scope.progressPercentage + '% ');
                           });
                        /*   dataServices.doUpload(file).then(function (response) {
                           }, function (error) {
                               console.log("Error");
                           }); */

                           $mdDialog.hide();
                       };



                 $scope.getMinute = function (code) {
                     var data = {};
                     data.email = sessionStorage.email;
                     data.auth_token = sessionStorage.authToken;
                     data.tag = code;

                     dataServices.getMinute(data).then(function (response) {
                         $scope.disableFeild = false;
                         if(response.data.success === true){
                             $mdToast.show($mdToast.simple().textContent(response.data.msg));
                             var lastMeet = response.data.data.ends_with;
                             var idArray = lastMeet.split(' - ');
                             var id = idArray[1];
                             $scope.datas.start_with = id.substring(2);
                             $scope.disable = true;

                         }
                         else if(response.data.success === false){
                                 $mdToast.show($mdToast.simple().textContent(response.data.msg));
                                 $scope.disable = false;
                                 $scope.datas.start_with = '';
                             }


                     }, function (error) {
                         $mdToast.show($mdToast.simple().textContent(error.data.msg));
                     }).catch(function (error) {
                         $mdToast.show($mdToast.simple().textContent(error.data.msg));
                     })
                 }
                   }






		   }]);
})();

