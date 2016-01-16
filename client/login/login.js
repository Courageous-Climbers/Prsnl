angular.module('gaussHyrax.login', ['LoginServices'])

.controller('loginController', ['$scope', 'UserFactory', 
  function($scope, UserFactory) {

  console.log($scope);

  $scope.saveUser = function() {
    UserFactory.saveUser($scope.user)
  }
  $scope.verifyUser = function () {
    UserFactory.verifyUser($scope.user)
  }

}]);

