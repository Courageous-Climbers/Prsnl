angular.module('familyServices', [])

.factory('FamilyFactor', ['$http', function($http) {

  var familyFactory = {}

  familyFactory.getAllFamilyMembers = function(userObj) {
    
    return $http({
      method : 'GET',
      url : '/api/family/569d8421b95c59b0339c5617'
    })
    .then(function(res) {
      console.log("getting the Family Members from the User ID", res);
    })
  }

  return familyFactory;



}])