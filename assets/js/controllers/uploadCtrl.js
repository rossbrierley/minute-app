(function(){
	angular.module('fileManager')
		   .controller('uploadCtrl',['$scope','Upload','$mdToast',function($scope, Upload,$mdToast) {
			//var storageRef = firebase.storage().ref();
			// var userRef = storageRef.child(userFolder.uid);
   $scope.upload = function (file) {
         console.log(file);
        Upload.upload({
            url: '/upload',
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
    };
		//    	$scope.uploader = function(){
		//    		$scope.uploadFiles = function(files) {
					  
		// 		if (files && files.length) {
		// 			for (var i = 0; i < files.length; i++) {
		// 				var storage = $firebaseStorage(storageRef.child(userFolder.uid).child(files[i].name));
		// 				var uploadTask = storage.$put(files[i]);
						
		// 				console.log(files[i]);
		// 			    uploadTask.$progress(function(snapshot) {
		// 				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		// 				var rate = 'Upload is ' + progress + '% done';
		// 				showToast(rate);
		// 				switch (snapshot.state) {
		// 					case firebase.storage.TaskState.PAUSED:
		// 						console.log('Upload is paused');
		// 						break;
		// 					case firebase.storage.TaskState.RUNNING:
		// 						console.log('Upload is running');
		// 						break;
		// 				}
		// 			});
		// 	 		}
		// 		}
		//   	}
		// };

		   }]);
})();


		//    	$scope.uploader = function(){
		//    		$scope.uploadFiles = function(files) {
					  
		// 		if (files && files.length) {
					  
		// 		for (var i = 0; i < files.length; i++) {
		// 		Upload.upload({
		// 			method:'POST',
		// 			url: 'http://localhost:8080/upload',
		// 			data: {
		// 				file: files[i]
		// 				}
		// 		}).then(function(resp) {
		// 			var msg = 'Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data;
		// 			showToast(msg);
		// 		}, function(resp) {
		// 			var errMsg = 'Error status: ' + resp.status;
		// 			showToast(errMsg);

		// 		}, function(evt) {
		// 			$scope.determinateValue = parseInt(100.0 * evt.loaded / evt.total);
		// 			console.log('progress: ' + $scope.determinateValue + '% ' + evt.config.data.file.name);
		// 		});
		// 	 }
		// 	}
		//   }
		// };