
(function() {
    angular.module('fileManager')
        .factory('dataServices', ['$http', '$q', function($http, $q) {
            var profileData = {};
            var isLoggedIn = false,
                churchId = '',
                authToken = '',
                churchEmail = '',
                churchName = '',
                sign_up_token = '';
            return {
                isLoggedInUser: function() {
                    return isLoggedIn;
                },
                isLogout: function() {
                    sessionStorage.clear();
                    ////console.log(sessionStorage);
                    isLoggedIn = false;
                    return true;
                },
                doSignIn: function(loginUser) {
                    return $http.post('/login/user', loginUser);
                },
                doMeeting: function(addMeeting) {
                    return $http.post('/addMeetings/newMeeting', addMeeting);
                },
                fetchMinutes: function (data) {
                    return $http.post('/minutes/index', data);
                },
                fetchCategory: function (data) {
                    return $http.post('/tags/index', data);
                },
                doEdit: function (data) {
                    return $http.post('/minute/edit', data);
                },
                doTag: function (data) {
                    return $http.post('/tag/add', data);
                },
                isVerified: function(user_email, user_role) {
                    var verificationObj = {
                        "_jsonobjid": "church",
                        "email": user_email,
                        "role": user_role,
                    }
                    ////console.log(verificationObj);
                    return $http.post('/email/verification', verificationObj);
                },
                doSignUp: function(signUpUser) {
                    //console.log(signUpUser);
                    return $http.post('/signup/newUser', signUpUser);
                },
                resetPasswordVerifyLink: function(data) {
                    return $http.post('/verify/link', data);
                },
                resetPassword: function(data) {
                    return $http.post('/password/reset', data);
                },
                forgotPassword: function(data) {
                    return $http.post('/forgotpassword/link', data);
                },

            }
        }]);
})();
