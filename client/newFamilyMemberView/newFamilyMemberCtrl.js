angular.module('gaussHyrax.newFamilyMember', ['rzModule', 'newFamilyMemberServices'])

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

    // Save family member to userId
    $scope.saveMember = function(member){
      NewFamilyMemberFactory.getUserID()
      .then(function (res){
        NewFamilyMemberFactory.saveMember(res.data, $scope.member);
        $scope.member = '';
      });
    };
}])
