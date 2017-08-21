(function(){
	angular.module('fileManager',['ui.router','ngRoute','LocalStorageModule', 'ngMaterial', 'ngMdIcons', 'ng-fx', 'ngAnimate','ngFileUpload','base64','ngSanitize','md.data.table'])
	.config(['$stateProvider', '$mdThemingProvider','$urlRouterProvider', function($stateProvider, $mdThemingProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('/', {
                url: '/login',
                templateUrl: '/views/login.html',
                controller: 'loginCtrl'
            })
            .state('upload', {
                url: '/upload',
                templateUrl: 'views/upload.html',
                controller: 'uploadCtrl',
                resolve : {
                    "isLoggedIn": function($state){
                        if(!sessionStorage.isLoggedIn){
                            $state.go('/');
                        }
                    }
                }
            })
            .state('all', {
                url: '/all',
                templateUrl: '/views/allFiles.html',
                controller: 'allFilesCtrl',
                resolve : {
                    "isLoggedIn": function($state){
                        if(!sessionStorage.isLoggedIn){
                            $state.go('/');
                        }
                    }
                }
            })
            .state('signup', {
            	url: '/signup',
            	templateUrl: '/views/signup.html',
                controller: 'signupCtrl'
            })
            .state('newMeeting', {
            	url: '/newMeeting',
                templateUrl: '/views/addMeetings.html',
                controller: 'addMeetingCtrl',
                resolve : {
                    "isLoggedIn": function($state){
                        if(!sessionStorage.isLoggedIn){
                            $state.go('/');
                        }
                    }
                }
            })
        	.state('previousMeetings', {
            url: '/previousMeetings',
            templateUrl: '/views/previousMeetings.html',
				controller: 'previousMinuteController',
                resolve : {
                    "isLoggedIn": function($state){
                        if(!sessionStorage.isLoggedIn){
                            $state.go('/');
                        }
                    }
                }
            })
            .state('viewMinute', {
                url: '/viewMinute',
                templateUrl: '/views/viewMinute.html',
				controller: 'previousMinuteController',
                resolve : {
                    "isLoggedIn": function($state){
                        if(!sessionStorage.isLoggedIn){
                            $state.go('/');
                        }
                    }
                }

            });

			/*$routeProvider.when('/', {
				templateUrl: 'views/upload.html',
				controller: 'uploadCtrl'
			})
			.when('/upload', {
				templateUrl: 'views/upload.html',
				controller: 'uploadCtrl'
				// resolve: {
				// 		userFolder : function(auth, rootRef, $firebaseStorage) {
				// 			return auth.$requireSignIn();
				// 				}
				// 		}
			})
			.when('/all', {
				templateUrl: '/views/allFiles.html',
				controller: 'allFilesCtrl'
			})
                .when('/login', {
						templateUrl: '/views/login.html',
					controller: 'loginCtrl'

                })
                .when('/signup', {
                    templateUrl: '/views/signup.html',
                    controller: 'signupCtrl'
                })
                .when('/newMeeting', {
                    templateUrl: '/views/addMeetings.html',
                    controller: 'addMeetingCtrl'

                })
                .when('/previousMeetings', {
                    templateUrl: '/views/previousMeetings.html',
					controller: 'previousMinuteController'

                })
                .when('/viewMinute', {
                    templateUrl: '/views/viewMinute.html',
					controller: 'viewMinuteController'

                })

			.otherwise({
        		redirectTo: '/'
      		}); */
			$mdThemingProvider.theme('default')
				.primaryPalette('blue-grey')
				.accentPalette('amber');
		}]);
})();

