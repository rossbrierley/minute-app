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
               function addController($scope,$mdDialog, $rootScope) {
                   $scope.tags = $rootScope.tags;
                   $scope.datas = {};

                       $scope.submit = function (file, datas) {
                           Upload.upload({
                               url: '/upload/add',
                               arrayKey: '',
                               data: {file: file, datas: datas},


                           }).then(function (resp) {
                               console.log('Success ' + resp.data + 'uploaded. Response: ' + resp.fal);
                           }, function (resp) {
                               console.log('Error status: ' + resp.status);
                           }, function (evt) {
                               var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                               console.log('progress: ' + progressPercentage + '% ');
                           });
                        /*   dataServices.doUpload(file).then(function (response) {
                           }, function (error) {
                               console.log("Error");
                           }); */

                           $mdDialog.hide();
                       };

                 /*  $scope.upload = function (file) {
                       console.log(file);
                       Upload.upload({
                           url: '/upload/add',
                           arrayKey: '',
                           data: {file: file},


                       }).then(function (resp) {
                           console.log('Success ' + resp.data + 'uploaded. Response: ' + resp.fal);
                       }, function (resp) {
                           console.log('Error status: ' + resp.status);
                       }, function (evt) {
                           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                           console.log('progress: ' + progressPercentage + '% ');
                       });
                   }; */
                   }






		   }]);
})();

