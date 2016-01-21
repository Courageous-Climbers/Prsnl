angular.module('notesModule', [])

.controller('notesController',['$scope',function($scope){

  $scope.singleNote = "";

  $scope.notesArray = []

  $scope.saveNote = function(note){
    $scope.notesArray.push(note);
    console.log("Note saved so far", $scope.notesArray)

  }

  // Currently not being used
  $scope.showAllNotes = function(){

  }

}]);