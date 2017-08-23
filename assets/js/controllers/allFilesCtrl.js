(function(){
	angular.module('fileManager')
		   .controller('allFilesCtrl',['$scope', '$mdDialog','dataServices', 'dataService','$http', 'dialogService','$rootScope', function($scope, $mdDialog, dataServices, dataService, $http, dialogService,$rootScope) {

		   	console.log(sessionStorage.isLoggedIn);
		   	dataService.getFiles()
				.then(onSuccess);

			function onSuccess(data) {
				$rootScope.item=[];
				for(var i=0;i<data.data.length;i++){
					$rootScope.item.push(data.data[i]);
					
					
				}
				$rootScope.items=$rootScope.item.splice(1);
			}
			$scope.openDocument = function(item) {
				var fileObj={
				"filename":	$rootScope.items[item]
				};
				dialogService.currentlyReading = item;
				$mdDialog.show({
					controller: function($scope, $mdDialog, dataService, dialogService) {
						$scope.cancel = function() {
							$mdDialog.cancel();	
						};
						$scope.current = dialogService.currentlyReading;
						
						dataService.showFile(fileObj).then(function(response){
						$scope.m =response.data.data;
						$rootScope.filename=response.data.filename;
						},function(error){
							console.log(error);
						});
					},
					templateUrl: 'views/dialog.html',
					parent: angular.element(document.body),
					clickOutsideToClose: true,
					fullscreen: true
				});
			}
			$scope.editFile =function()
			{
				console.log($scope.m);
				var editObj = {
					"filename": $rootScope.filename,
					"data":$scope.m
				}
				dataServices.editFile(editObj).then(function(response){
					console.log(response.data);
				});
			};

               var data = {
                   "email" : sessionStorage.email,
                   "auth_token": sessionStorage.authToken
               };

               dataServices.fetchUploadFile(data).then(function (response) {
                   console.log(response);
                   $rootScope.file_data = response.data.data;
               });

               dataServices.fetchCategory(data).then(function (response) {
                   console.log(response);
                   $rootScope.tags = response.data.data;
               });



		}])
		.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
})
		.filter('trustAsResourceUrl', ['$sce', function($sce) {
			return function(val) {
				return $sce.trustAsResourceUrl(val);
			};

		   }]);
})();