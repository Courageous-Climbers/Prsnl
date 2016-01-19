angular.module('notesModule', [])

.controller('notesController',['$scope',function($scope){

  $scope.singleNote = "";

  $scope.notesArray = []

  $scope.saveNote = function(note){
    $scope.notesArray.push(note);

  }

  $scope.showAllNotes = function(){

  }

}]);