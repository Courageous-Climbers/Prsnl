angular.module('gaussHyrax.action', [])

.controller('actionController',['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.actionArray = [];
  $scope.allFamilyActionsArray = [];
  
  $scope.callDate = new Date();
  $scope.textDate = new Date();
  $scope.sendLetterDate = new Date();
  $scope.sendEmailDate = new Date();
  $scope.dinnerDate = new Date();
  $scope.drinksDate = new Date();
  $scope.lunchDate = new Date();
  $scope.coffeeDate = new Date();

// get the user ID
  var userId = $window.localStorage.getItem('com.hyrax');
  // console.log("\nUserID: ", userId);
  
  var famMemberId = $scope.member._id;
  //console.log("All the info for a this fam member: ", $scope.member);
  // console.log("Family Member Id: ", famMemberId);

  var currentNote;
  // Listen for the note to be emitted from the event in the child view (notes.js)
  $scope.$on('noteSavedEvent', function(event, data) { 
    currentNote = data;
  });

  $scope.saveAction = function(someAction, pointValue, dateOccured){
    var actionObj = {
      action: someAction,
      points: pointValue,
      date: dateOccured,
      notes: currentNote || "" 
    };

   
    $http({
      method : 'POST',
      // url : '/api/history/569ec22768237e7114d26c19/569ec22768237e7114d26c1d',
      url : '/api/history/' + userId + "/" + famMemberId,
      data : actionObj,
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(res) {
      console.log("Response from the saveAction POST Request: ", res);
    })
  
  };

  $scope.getAFamilyMemberActions = function (familyId){
    $http({
      method : 'GET',
      // url: '/api/family/'+ '569ec22768237e7114d26c19'+'/'+'569ec22768237e7114d26c1d'
      url: '/api/family/' + userId + "/" + famMemberId
    }).then(function(res){
      //console.log('here is the response',res);
      
      if(res.data.history.length){
        console.log("Heres is the response.data: ", res.data)
       // console.log("Here is the response data", res.data.history)
        //an array of actions were returned
        // $scope.actionArray = res.data;
        for (var i=0; i<res.data.history.length; i++){
          $scope.actionArray.push(res.data.history[i])
        }
      }
    },function(err){
      console.log('!error',err);
    });
  }



}]);

//Gandalf User id: 569e819c795f2dd613ae3619
// new 569eab71b0a5b02d14272c92
// 569ec22768237e7114d26c19

// Family member Frodo id: 569ea8771d5b871d14197363
//new 569eab71b0a5b02d14272c96
// 569ec22768237e7114d26c1d

// RETURNS THE USER ID
//>>>curl -i http://localhost:3000/api/user/Gandalf/DeezNuts


// RETURN THE FAMILY INFO:
//curl -i http://localhost:3000/api/family/569ea8771d5b871d1419735f

// TRYING TO ADD ACTION..BUT EMPTY REPLY AND SERVER CRASH:
// curl -d '{"action":"HISTORY UPDATE WITH NEW ACTION SOLA"}' -H "Content-Type: application/json" http://localhost:3000/api/history/569e819c795f2dd613ae3619/569ea8771d5b871d14197363
// curl: (52) Empty reply from server



// add history to a user's family member '/api/history/:userId/:familyId' 
// curl -d '{"action":"test2"}' -H "Content-Type: application/json" 
// http://localhost:3000/api/history/569d49d66d5c5ab72d1be6fb/569d49e46d5c5ab72d1be6fc

