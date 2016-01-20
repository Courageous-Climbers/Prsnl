angular.module('LoginServices', [])

.factory('UserFactory', ['$http', function($http) {
  var userFactory = {}


  userFactory.saveUser = function(userObj) {
    return $http({
      method : 'POST',
      url : '/api/user',
      data : userObj
    })

  }

  userFactory.verifyUser = function(userObj) {

    return $http({
      method : 'GET',
      url : '/api/user/' + userObj.userName + '/' + userObj.password,
      //params : userObj  // {userName:"Nick",password:"123"}
    });
    // .then(function(res){
    //   console.log(res);
    //   return res;
    // })

  }
// May need to return an object with the function

return userFactory; 

}])