angular.module('actionModule', [])

.controller('actionController',['$scope', '$http', function($scope, $http){

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


  $scope.saveAction = function(someAction, pointValue, dateOccured, someNote){
    var actionObj = {
      action: someAction,
      points: pointValue,
      date: dateOccured,
      // notes are HARD CODED.  FIX THIS LATER IF TIME ALLOWS
      notes: "ITS HOT IN THIS CAFE!!!!"
    };

    //$scope.actionArray.push(actionObj);  //may not need
    //console.log ("The action array: ", $scope.actionArray);

    $http({
      method : 'POST',
      // url : '/api/history/:userId/:familyId',
      // hard coded the userid and familyid 
      url : '/api/history/569ec22768237e7114d26c19/569ec22768237e7114d26c1d',
      data : actionObj,
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(res) {
      //console.log("Response from the saveAction POST Request: ", res);
    })
  
  };

  // Commented out because we don't EVERY FAMLIY MEMBERS action in the action view
  
  // $scope.getAllSubmittedActions = function(){
  //   console.log("Get getSubmittedAllActions called");
  //   $http({
  //     method : 'GET',
  //     url: '/api/family/'+ '569ec22768237e7114d26c19'
  //   }).then(function(res){
  //     console.log('here is the response',res);
      
  //     if(res.data.length){
  //       console.log("Here is the response data", res.data)
  //       for (var i=0; i<res.data.length; i++){
  //         $scope.allFamilyActionsArray.push(res.data[i].history)
  //       }
  //     }
  //   },function(err){
  //     console.log('!error',err);
  //   });
    


  // };

  $scope.getAFamilyMemberActions = function (familyId){
    //console.log("Get getAFamilyMemberActions called");
    $http({
      method : 'GET',
      url: '/api/family/'+ '569ec22768237e7114d26c19'+'/'+'569ec22768237e7114d26c1d'
    }).then(function(res){
      //console.log('here is the response',res);
      
      if(res.data.history.length){
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

