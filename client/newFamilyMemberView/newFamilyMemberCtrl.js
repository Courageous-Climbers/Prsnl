angular.module('gaussHyraxx.newFamilyMember', ['rzModule', 'newFamilyMemberServices'])

.controller('memberCtrl', ['$scope', 'NewFamilyMemberFactory',
function($scope, NewFamilyMemberFactory){
  // Slider for the contact frequency.
  $scope.slider_toggle = {
      value: 14,
      options: {
        floor: 0,
        ceil: 14,
        step: 1,
        showSelectionBar: true
      }
    };


    console.log("contoller");
    // Save family member to userId
    $scope.saveMember = function(member){
      console.log("inside save member");

      console.log($scope.member);
      NewFamilyMemberFactory.getUserID()
      .then(function (res){
        console.log(typeof res.data[0]._id);
        NewFamilyMemberFactory.saveMember(res.data[0]._id, $scope.member);
      });
    };

}]);
