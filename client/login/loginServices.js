angular.module('LoginServices', ['gaussHyrax.login'])

.factory('UserFactory', ['$http', function($http) {
  var userFactory = {}


  userFactory.saveUser = function(userObj) {
    return $http({
      method : 'POST',
      url : '/api/user',
      data : userObj
    })
    .then(function(res) {
      console.log("Response from the saveUser POST Request: ", res);
    })
  }

  userFactory.verifyUser = function(userObj) {
    console.log(userObj)
      return $http({
        method : 'GET',
        url : '/api/user',
        params : userObj  // {userName:"Nick",password:"123"}
      })
      .then(function(res) {
        console.log("Verifying the user: ", res);
      })
    }
// May need to return an object with the function

return userFactory; 

}])