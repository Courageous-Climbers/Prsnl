angular.module('newFamilyMemberServices', [])

.factory('NewFamilyMemberFactory', ['$http', function($http) {
  var familyMemberFactory = {};

  familyMemberFactory.getUserID = function() {
    return $http({
      method: 'GET',
      url: '/api/user/Gandalf/DeezNuts'
    });
  };


  familyMemberFactory.saveMember = function(userId, memberObj) {
    console.log("this is userID: ", userId);
    console.log("this is memberObj: ", memberObj);
    return $http({
      method : 'POST',
      url : '/api/family/' + userId,
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
