angular.module('gaussHyrax.newFamilyMember', ['rzModule', 'newFamilyMemberServices'])

.controller('memberCtrl', ['$scope', 'NewFamilyMemberFactory',
function($scope, NewFamilyMemberFactory){
  // Slider for the contact frequency.

  $scope.slider_toggle = {
      value: 14,
      options: {
        floor: 1,
        ceil: 14,
        step: 1,
        showSelectionBar: true,
        onEnd: function () {
          $scope.nextDate = moment().add($scope.slider_toggle.value, 'days').calendar();
        }
      }
    };

    // Save family member to userId
    $scope.saveMember = function(){
      var member = {
        firstName: $scope.member.firstName,
        lastName: $scope.member.lastName,
        phoneNumber: $scope.member.phoneNumber,
        email: $scope.member.email,
        streetAddress: $scope.member.streetAddress,
        city: $scope.member.city,
        state: $scope.member.state,
        country: $scope.member.country,
        zipcode: $scope.member.zipcode,
        nextContactDate: $scope.nextDate,
        contactFrequency: $scope.slider_toggle.value
      }
      console.log("This is an obj create in controller: ", member)
      NewFamilyMemberFactory.getUserID()
      .then(function (res){
        NewFamilyMemberFactory.saveMember(res.data, member);
        $scope.member = '';
      });
    };

}])
