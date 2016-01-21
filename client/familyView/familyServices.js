angular.module('FamilyServices', [])

.factory('FamilyFactory', ['$http', '$window', function($http, $window) {

  var familyFactory = {}

  console.log('factory loaded');

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
      console.log("Getting the Family Members from the User ID", res);
      return res;
    })
  }

  return familyFactory;

}])