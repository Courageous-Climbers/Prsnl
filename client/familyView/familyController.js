angular.module('gaussHyrax.family', ['FamilyServices', 'ngAnimate'])

.controller('familyController', ['$scope', 'FamilyFactory', 
  function($scope, FamilyFactory){

  var userID;
  $scope.familyData;
  $scope.activeFamilyMember;

    FamilyFactory.getAllFamilyMembers()
      .then(function(res) {
        $scope.familyData = res.data;
        $scope.date = moment($scope.familyData.nextContactDate).format('MMM Do YYYY');
      });


    $scope.$on('points',function(event,data){
      console.log('here are the points',data);
    })
    // Modal controller
    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    // $scope.expandActionsView = false;
    $scope.checkActions = function(familyMemberObj) {
      console.log(familyMemberObj);
      $scope.expandActionsView = familyMemberObj;
      
    }

    $scope.singleFamilyMemberInfo = function(familyMemberObj) {
      console.log(familyMemberObj);
      //change the $scope.activeFamilyMember so that a $watch event will fire
      $scope.activeFamilyMember = familyMemberObj;
    }

}])
.directive('modalDialog', function() {
  return {
   restrict: 'E',
   scope: {
     show: '='
   },
   replace: true, // Replace with the template below
   transclude: true, // we want to insert custom content inside the directive
   link: function(scope, element, attrs) {
     scope.dialogStyle = {};
     if (attrs.width)
       scope.dialogStyle.width = attrs.width;
     if (attrs.height)
       scope.dialogStyle.height = attrs.height;
     scope.hideModal = function() {
       scope.show = false;
     };
   },
   template: "<div class='ng-modal' ng-show='show'> <div class='ng-modal-overlay' ng-click='hideModal()'></div> <div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>" // See below
 };
})
