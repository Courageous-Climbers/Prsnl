angular.module('gaussHyrax.summary',['SummaryServicesModule'])

.controller('summaryCtrl',['$scope','SummaryFactory',function($scope,SummaryFactory){
  console.log('summary controller loaded');

  //$scope.familyData is from the familyViewController

  //just computes data for  the first family member
  var familyPlot = SummaryFactory.calculatePoints($scope.familyData);
  //create chart
  console.log('familyPlot',familyPlot);
  SummaryFactory.makeChart(familyPlot);


}])