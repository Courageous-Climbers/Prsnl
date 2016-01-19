angular.module('gaussHyrax.family', ['FamilyServices'])

.controller('familyController', ['$scope', 'FamilyFactory', function($scope, FamilyFactory){
  
  console.log('controller loaded');
  var userID;
  var familyData;

  $scope.fs = FamilyFactory.getUserID()
    .then(function(userID){
      FamilyFactory.getAllFamilyMembers(userID.data)
      .then(function(familyMember) {
        $scope.familyData = familyMember.data;
      });
    });



  

}])