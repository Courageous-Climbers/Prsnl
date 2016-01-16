angular.module('gaussHyrax.login', ['LoginServices'])

.controller('loginController', ['$scope', '$location','UserFactory', 
  function($scope, $location, UserFactory) {

  console.log($scope);

  $scope.saveUser = function() {
    UserFactory.saveUser($scope.user)
  }
  $scope.verifyUser = function () {
    UserFactory.verifyUser($scope.user).then(function(res){
      console.log('here is the response',res);
      
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

