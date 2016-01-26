angular.module('FamilyServices', [])

.factory('FamilyFactory', ['$http', function($http) {

  var familyFactory = {};

  // Get all the family Members data from the Mongo Database using the user id
  familyFactory.getAllFamilyMembers = function(id) {
    
    return $http({
      method : 'GET',
      url : '/api/family/' + id
    })
    .then(function(res) {
      console.log("Getting the Family Members from with USER ID: ", id);
      return res;
    })
  }

  return familyFactory;

}])