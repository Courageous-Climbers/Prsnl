angular.module('FamilyServices', [])

.factory('FamilyFactory', ['$http', '$window', function($http, $window) {

  var familyFactory = {}

  familyFactory.getUserID = function() {
    return $http({
      method : 'GET',
      url : '/api/user/' + $window.localStorage.getItem('com.hyrax')
    })
  }

  familyFactory.getAllFamilyMembers = function() {
    
    return $http({
      method : 'GET',
      url : '/api/family/' + $window.localStorage.getItem('com.hyrax')
    })
    .then(function(res) {
      // console.log("Getting the Family Members from the User ID", res);
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