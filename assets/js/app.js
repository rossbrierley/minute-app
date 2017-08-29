(function(){
	angular.module('fileManager',['ui.router','ngRoute','LocalStorageModule', 'ngMaterial', 'ngMdIcons', 'ng-fx', 'ngAnimate','ngFileUpload','base64','ngSanitize','md.data.table','htmlToPdfSave','ngCookies'])
	.config(['$stateProvider', '$mdThemingProvider','$urlRouterProvider','$locationProvider' , function($stateProvider, $mdThemingProvider,$urlRouterProvider, $locationProvider) {
        $locationProvider
            .html5Mode(false);
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
            	url: '/addNewMeeting',
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
            .state('settings', {
                url: '/settings',
                templateUrl: '/views/settings.html',
                controller: 'tagCtrl',
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

            })
            $urlRouterProvider.otherwise('/login');;

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

