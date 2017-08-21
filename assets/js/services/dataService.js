(function() {
	angular.module('fileManager')
		   .factory('dataService',['$http','$log','$q',
		   	function($http,$log,$q){
		   	return {
		   			getFiles : getFiles,
					showFile : showFile,
					editFile :editFile
		   		};
		   	function getFiles(){
		   		return $http({
					   method: 'POST',
					   url:'/allfiles'
				   });
		   			function onSuccess(response){
		   				return response.data;
		   			}
		   			function onError(response){
		   				return $q.reject('Error ' + response.status);
		   			}
		   		}
				   function showFile(fileObj){
					   console.log("hello");
                    return $http({
						method:'POST',
						url:'/show',
						data:fileObj
					})
				   }
				   function editFile(editObj){
					   return $http({
						   method: 'POST',
						   url:'/edit',
						   data: editObj
					   })
				   }
		   
	}])
})();