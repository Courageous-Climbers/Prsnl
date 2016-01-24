angular.module('gaussHyrax.action', [])

.controller('actionController',['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.actionArray = [];
  $scope.allFamilyActionsArray = [];
  $scope.selectedAction = "Click an action";
  $scope.points = 0;
  
  // Using moment to convert date into a simpler format
  $scope.dateEntered = moment(new Date()).format('MMM DD YYYY');


  // $scope.callDate = moment(new Date()).format('MMM DD YYYY');
  // $scope.textDate = moment(new Date()).format('MMM DD YYYY');
  // $scope.sendLetterDate = moment(new Date()).format('MMM DD YYYY');
  // $scope.sendEmailDate = moment(new Date()).format('MMM DD YYYY');
  // $scope.dinnerDate = moment(new Date()).format('MMM DD YYYY');
  // $scope.drinksDate = moment(new Date()).format('MMM DD YYYY');
  // $scope.lunchDate = moment(new Date()).format('MMM DD YYYY');
  // $scope.coffeeDate = moment(new Date()).format('MMM DD YYYY');

  // get the user ID
  var userId = $window.localStorage.getItem('com.hyrax');
  // console.log("\nUserID: ", userId);
  
  var famMemberId = $scope.member._id;
  // console.log("All the info for a this fam member: ", $scope.member);

  var currentNote;
  // Listen for the note to be emitted from the event in the child view (notes.js)
  $scope.$on('noteSavedEvent', function(event, data) { 
    currentNote = data;
  });

  $scope.setAction = function(anAction, pts){
    $scope.selectedAction = anAction;
    $scope.points = pts;
  }

  $scope.singleNote = "";  // Keep the note field blank by default

  // Note gets captured from the DOM
  // The note is then emitted so the parent controller (in action.js) can see it
  $scope.saveNote = function(note){
    $scope.$emit('noteSavedEvent', note);
    $scope.singleNote = "";  //Empty notes field once its submitted
  }

  $scope.saveAction = function(someAction, pointValue, dateOccured){
    if (someAction === "Click an action"){
      console.log("No action selected, submit ignored");
      return
    }
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
      // console.log("Response from the saveAction POST Request: ", res);
      //console.log("\n\nrepsonse.data is: ", res.data);
      //console.log("history before: ", $scope.member.history);
      
      // added by request of Nick, may need to emit this res.data and the  famMemberId
      $scope.member.history.push(res.data);
      console.log("history after: ", $scope.member.history);
      $scope.$emit('historyUpdateEvent', famMemberId, res.data);


    })
  
  };

  $scope.getAFamilyMemberActions = function (familyId){
    $http({
      method : 'GET',
      // url: '/api/family/'+ '569ec22768237e7114d26c19'+'/'+'569ec22768237e7114d26c1d'
      url: '/api/family/' + userId + "/" + famMemberId
    }).then(function(res){
      // Check that history of actions exist for this family member
      if(res.data.history.length){
        for (var i=0; i<res.data.history.length; i++){
          // convert the date into a simpler format
          res.data.history[i].date = moment(res.data.history[i].date).format('MMM DD YYYY');
          $scope.actionArray.push(res.data.history[i])
        }
      }
    },function(err){
      console.log('error!!',err);
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


// add history to a user's family member '/api/history/:userId/:familyId' 
// curl -d '{"action":"test2"}' -H "Content-Type: application/json" 
// http://localhost:3000/api/history/569d49d66d5c5ab72d1be6fb/569d49e46d5c5ab72d1be6fc

