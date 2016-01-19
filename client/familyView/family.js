anuglar.module('gaussHyrax.family', ['familyServices'])

.controller('familyController', ['$scope', function($scope){

  $scope.familyData = function() {
    familyServices.getAllFamilyMembers()
    .then(function(res) {
      console.log("Controller Response:", res);
    })
  }

  console.log($scope);

}])