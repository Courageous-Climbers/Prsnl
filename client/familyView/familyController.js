angular.module('gaussHyrax.family', ['FamilyServices'])

.controller('familyController', ['$scope', 'FamilyFactory', function($scope, FamilyFactory){
  
  console.log('controller loaded');
  var userID;
  var familyData;

  $scope.familyData = FamilyFactory.getUserID()
    .then(function(userID){
      console.log(userID.data);
      FamilyFactory.getAllFamilyMembers(userID.data)
      .then(function(familyMember) {
        $scope.familyData = familyMember.data;
      });
    });



  

}])