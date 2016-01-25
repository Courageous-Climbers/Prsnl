angular.module('gaussHyrax.action', [])

.controller('actionController',['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.actionArray = [];
  $scope.allFamilyActionsArray = [];
  $scope.selectedAction = "Click an action";
  $scope.points = 0;
  
  // Using moment to convert date into a simpler format
  $scope.dateEntered = moment(new Date()).format('MMM DD YYYY');

  // get the user ID
  var userId = $window.localStorage.getItem('com.hyrax');
  // console.log("\nUserID: ", userId);
  
  var famMemberId = $scope.member._id;
  // console.log("All the info for a this fam member: ", $scope.member);

  // No longer needed because notes are now in the action controller/html instead
  // of a notes controller/html
  // var currentNote;
  // Listen for the note to be emitted from the event in the child view (notes.js)
  // $scope.$on('noteSavedEvent', function(event, data) { 
  //   currentNote = data;
  // });

  // Sets the action based on the user click
  $scope.setAction = function(anAction, pts){
    $scope.selectedAction = anAction;
    $scope.points = pts;
  }

  $scope.singleNote = "";  // Keep the note field blank by default

  // Note gets captured from the DOM
  // The note is then emitted so the parent controller (in action.js) can see it

  // No longer needed
  // $scope.saveNote = function(note){
  //   $scope.$emit('noteSavedEvent', note);
  //   $scope.singleNote = "";  //Empty notes field once its submitted
  // }

  $scope.saveAction = function(someAction, pointValue, dateOccured, someNote){
    if (someAction === "Click an action"){
      console.log("No action selected, submit ignored");
      $scope.noActionYet = "No action selected."
      return
    }
    $scope.noActionYet = "";
    
    var actionObj = {
      action: someAction,
      points: pointValue,
      date: dateOccured,
      notes: someNote 
    };

    $scope.singleNote = "";  // Clear the notes field after submission

    $http({
      method : 'POST',
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
      //console.log("history after: ", $scope.member.history);
      $scope.$emit('historyUpdateEvent', famMemberId, res.data);


    })
  
  };

  $scope.getAFamilyMemberActions = function (familyId){
    $http({
      method : 'GET',
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

