angular.module('gaussHyrax.family', ['FamilyServices', 'ngAnimate'])

.controller('familyController', ['$scope', 'FamilyFactory', 
  function($scope, FamilyFactory){

  var userID;
  $scope.familyData;
  $scope.activeFamilyMember;
  
    $scope.$on('points', function(event, totalPoints) {
      // console.log("Here are the Points from the Summary Controller: ", totalPoints);
      for (var i = 0; i < $scope.familyData.length; i++) {
        for (var key in totalPoints) {
          if (key === $scope.familyData[i]._id){
            // Set the property of points on the familyData to be the totalPoints
            $scope.familyData[i].points = totalPoints[key] || 0;
          }
        }
      } 
    });


    FamilyFactory.getAllFamilyMembers()
      .then(function(res) {
        $scope.familyData = res.data;

        // Format the date from the Database into more readable format using moment
        _.each($scope.familyData, function(eachFamilyMember, index) {
          $scope.familyData[index].nextContactDate = moment(eachFamilyMember.nextContactDate).format('MMM DD YYYY');
        });

        // Calculate the total Points from the Family History Action Points Property
        // The points are not currently coming from the Summary View.
        _.each($scope.familyData, function(eachFamilyMember, index) {
          eachFamilyMember.totalPoints = _.reduce(eachFamilyMember.history, function(total, action) {
            total += action.points;
            return total;
          }, 0);
        });

        //when summary controller loads, let it know that there is family data available
        $scope.$on('summaryCtrlLoaded',function(){
          console.log('triggering family change');
          $scope.$broadcast('familyChange',$scope.familyData);
        });
        
      });



    // Modal controller
    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    // $scope.expandActionsView = false;
    $scope.checkActions = function(familyMemberObj) {
      // console.log(familyMemberObj);
      $scope.expandActionsView = familyMemberObj;
      
    }

    $scope.singleFamilyMemberInfo = function(familyMemberObj) {
      // console.log(familyMemberObj);
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
