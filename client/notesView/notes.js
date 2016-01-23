angular.module('gaussHyrax.notes', [])

.controller('notesController',['$scope',function($scope){

  $scope.singleNote = "";  // Keep the note field blank by default

  // Note gets captured from the DOM
  // The note is then emitted so the parent controller (in action.js) can see it
  $scope.saveNote = function(note){
    $scope.$emit('noteSavedEvent', note);
    $scope.singleNote = "";  //Empty notes field once its submitted
  }

  // Currently not being used
  $scope.showAllNotes = function(){

  }

}]);