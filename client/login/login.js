angular.module('gaussHyrax.login', ['LoginServices'])

.controller('loginController', ['$scope', '$location','$window','UserFactory', 
  function($scope, $location, $window, UserFactory) {

  //login page is loading
  //delete the token if exists
  $window.localStorage.removeItem('com.hyrax');

  $scope.saveUser = function() {
    UserFactory.saveUser($scope.user).then(function(){
      $window.localStorage.setItem('com.hyrax',res.data);
      $location.path('/dashboard');
    });
    
  }

  $scope.verifyUser = function () {
    UserFactory.verifyUser($scope.user).then(function(res){
      console.log('here is the response',res);
      console.log('storing');
      //save user id in local storage
      $window.localStorage.setItem('com.hyrax',res.data);
      
      if(res.data.length){
        //a user profile was returned, so forward them to their dashboard
        $location.path('/dashboard');
      }
      //else no user object was returned, so keep here

    },function(err){
      console.log('!error',err);
    });
  }

}]);

