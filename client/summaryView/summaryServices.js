angular.module('SummaryServicesModule',[])

.factory('SummaryFactory',['$http','$window',function($http,$window){
  console.log('summary factory loaded');
  var chart;
  var factory = {};

  factory.makeChart = function(data){
    console.log(data);
    chart = c3.generate({
      bindto: '#chart',
      data:{
        x:'x',
        columns: data
        //groups: data.x,
      },
      axis: {
        x: {
            type: 'category', // this needed to load string x value
        },
      },
      legend: {
        hide: true
      }
    });

  };


  factory.calculatePoints = function(history,name){
    var minDate = history[0].date;
    var day = moment(minDate);
    var now = moment();
    
    var days = [];
    var dayIdx = {};
    var points =[];

    var dateFormat = "MMM D, YY";
    var i = 0;
    while(day < now){

      days.push(day.format(dateFormat));
      dayIdx[day.format(dateFormat)] = i;
      day.add(1,'days');
      i++;
    }

    console.log(dayIdx);

    //initialize points array to be 0
    for (var i = 0; i < days.length; i++) {
      points[i] = 0;
    }

    //add points
    for (var i = 0; i < history.length; i++) {
      points[dayIdx[moment(history[i].date).format(dateFormat)]]++;
    }

    //return data in special format for c3
    return [_.flatten(['x',days]), _.flatten([name,points])];
  };

  factory.getData = function(){
    return $http({
      method: 'GET',
      url: '/api/family/' + $window.localStorage.getItem('com.hyrax')
    })
  }
  return factory;

}])