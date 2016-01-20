angular.module('FamilyServices', [])

.factory('FamilyFactory', ['$http', function($http) {

  var familyFactory = {}

  console.log('factory loaded');

  familyFactory.getUserID = function() {
    return $http({
      method : 'GET',
      url : '/api/user/Gandalf/DeezNuts'
    })
  }

  familyFactory.getAllFamilyMembers = function(userID) {
    
    return $http({
      method : 'GET',
      url : '/api/family/' + userID
    })
    .then(function(res) {
      console.log("Getting the Family Members from the User ID", res);
      return res;
    })
  }

  return familyFactory;

}])