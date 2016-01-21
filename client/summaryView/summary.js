angular.module('gaussHyrax.summary',['SummaryServicesModule'])

.controller('summaryCtrl',['$scope','SummaryFactory',function($scope,SummaryFactory){
  console.log('summary controller loaded');
  SummaryFactory.getData().then(function(res){

    //just computes data for  the first family member
    var familyPlot = SummaryFactory.calculatePoints(res.data[0].history,res.data[0].firstName + ' ' + res.data[0].lastName);

    //create chart
    SummaryFactory.makeChart(familyPlot);
  })


}])