angular.module('gaussHyrax.summary',['SummaryServicesModule'])

.controller('summaryCtrl',['$scope','SummaryFactory',function($scope,SummaryFactory){
  console.log('summary controller loaded');

  $scope.who = "Everybody"

  //will change the plot to a single family member when the active member is clicked
  //activeFamilyMember is set by familyController
  $scope.$watch('activeFamilyMember',function(){
    console.log('familyMember selected, changing graph...');
    if($scope.activeFamilyMember){
      var singlePlot = SummaryFactory.calculateGraphForOneFamilyMember($scope.activeFamilyMember['_id'])
      SummaryFactory.makeChart(singlePlot);
      $scope.who = $scope.activeFamilyMember.firstName + ' ' + $scope.activeFamilyMember.lastName 
    }else{
      console.log('cannot plot, family member not specified');
    }
  });

  //will recompute all the graphs when familyData is changed
  //will also emit a points event so that family controller has access to them
  $scope.$on('familyChange',function(event,familyData){
    console.log('familyData changed, recomputing all graphs...');
    if($scope.familyData){
      var data = SummaryFactory.calculateGraphForSetOfFamilyMembers($scope.familyData);
      SummaryFactory.makeChart(data);
      $scope.$emit('points', SummaryFactory.currentPointValue);
    }else{
      console.log('cannot plot, family not specified');
    }
  });

  //let the familyView controller know that this controller has loaded
  $scope.$emit('summaryCtrlLoaded');
}])