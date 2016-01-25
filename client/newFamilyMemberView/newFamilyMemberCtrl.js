angular.module('gaussHyrax.newFamilyMember', ['rzModule', 'newFamilyMemberServices'])

.controller('memberCtrl', ['$scope', 'NewFamilyMemberFactory',
function($scope, NewFamilyMemberFactory){
  // Slider for the contact frequency.
  $scope.member = {};

  $scope.slider_toggle = {
      value: 14,
      options: {
        floor: 1,
        ceil: 14,
        step: 1,
        showSelectionBar: true,
        onEnd: function () {
          $scope.nextDate = moment().add($scope.slider_toggle.value, 'days').format('MMM DD YYYY');
        }
      }
    };

    // Save family member to userId
    $scope.saveMember = function(){
      $scope.member.nextContactDate = $scope.nextDate,
      $scope.member.contactFrequency = $scope.slider_toggle.value

      console.log("This is an obj create in controller: ", $scope.member)
      NewFamilyMemberFactory.saveMember($scope.member)
      .then(function(data){
        data.nextContactDate = moment(data.nextContactDate).format('MMM DD YYYY');
        data.points = 0;
        $scope.familyData.push(data);
        $scope.$emit('addedFam')
      });
      $scope.member = '';
      $scope.$parent.toggleModal()
    }

}])
