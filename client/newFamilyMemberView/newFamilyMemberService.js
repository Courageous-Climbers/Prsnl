angular.module('newFamilyMemberServices', [])

.factory('NewFamilyMemberFactory', ['$http', '$window', function($http, $window) {
  var familyMemberFactory = {};

  familyMemberFactory.getUserID = function() {
    return $http({
      method: 'GET',
      url: '/api/user/' + $window.localStorage.getItem('com.hyrax')
    });
  };


  familyMemberFactory.saveMember = function(memberObj) {
    
    console.log("this is memberObj: ", memberObj);
    return $http({
      method : 'POST',
      url : '/api/family/' + $window.localStorage.getItem('com.hyrax'),
      headers: {
        'Content-Type': 'application/json'
      },
      data : memberObj
    })
    .then(function(res) {
      console.log("Response from the saveUser POST Request: ", res);
    });
  };


return familyMemberFactory;

}]);
