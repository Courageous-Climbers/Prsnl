angular.module('gaussHyrax.nav', [])

.controller('navCtrl', ['$scope', function($scope){

  $scope.reload = function(){
    window.location.reload();
  };
}])
