angular.module('FamilyServices', [])

.factory('FamilyFactory', ['$http', '$window', function($http, $window) {

  var familyFactory = {};

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

/*  family.factory.getSingleFamilyMember = function() {

    return $http({
      method: 'GET',
      url : '/api/family/' + 
    })

  }*/

  return familyFactory;

}])