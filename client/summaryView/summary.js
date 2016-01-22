angular.module('gaussHyrax.summary',['SummaryServicesModule'])

.controller('summaryCtrl',['$scope','SummaryFactory',function($scope,SummaryFactory){
  console.log('summary controller loaded');

  $scope.who = "Everybody"
  //computes data for the whole family on load
  //$scope.familyData is from the familyViewController
  var familyPlot = SummaryFactory.calculateGraphForSetOfFamilyMembers($scope.familyData);
  SummaryFactory.makeChart(familyPlot);
  $scope.$emit('points', SummaryFactory.currentPointValue);

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
  $scope.$watch('familyData',function(){
    console.log('familyData changed, recomputing all graphs...');
    if($scope.familyData){
      SummaryFactory.calculateGraphForSetOfFamilyMembers($scope.familyData);
      $scope.$emit('points', SummaryFactory.currentPointValue);
    }else{
      console.log('cannot plot, family not specified');
    }
  });


}])