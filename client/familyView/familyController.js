angular.module('gaussHyrax.family', ['FamilyServices'])

.controller('familyController', ['$scope', 'FamilyFactory', function($scope, FamilyFactory){
  
  console.log('controller loaded');
  var userID;
  var familyData;

   FamilyFactory.getUserID()
    .then(function(userID){
    
    userID = userID.data;
    console.log("userID:", userID);

    FamilyFactory.getAllFamilyMembers(userID)
    .then(function(familyMembers) {
      $scope.familyData = familyMembers.data;
      console.log("Controller Response:", familyData);
    })

  });



  

}])