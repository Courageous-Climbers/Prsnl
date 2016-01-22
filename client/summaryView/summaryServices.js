angular.module('SummaryServicesModule',[])

.factory('SummaryFactory',['$http','$window',function($http,$window){
  console.log('summary factory loaded');
  var chart;
  var factory = {};
  var rendered;
  factory.makeChart = function(data){
    var xAxis;

    chart = c3.generate({
      
      bindto: '#chart',
      data:{
        x:'x',
        columns: data,
        type: 'area'
        //groups: data.x,
      },
      onrendered:function(){
        if(!rendered){
          xAxis = d3.selectAll('g .c3-axis-x .tick');
          rendered = true;
        }
        xAxis.style({'opacity':0});
      },
      axis: {
        x: {
            type: 'category', // this needed to load string x value
            label: {
              text: 'Time',
              position: 'outer-center'
            }
        },
        y: {
          label: {
              text: 'Points',
              position: 'outer-middle'
            }
        }
      },
      legend: {
        hide: true
      },
      subchart: {
        show: true,
        size: {
          height: 20
        }
      },
      zoom: {
        enabled: true
      }
    });
 
  };

  var makeSeriesForOneFamilyMember = function(familyMember,dayIdx, dateFormat){
    var points=[];
    var lastPoints = 0;
    var numDays = Object.keys(dayIdx).length;
    //initialize points array to be 0
    for (var i = 0; i < numDays; i++) {
      points[i] = 0;
    }

    //add points
    for (var i = 0; i < familyMember.history.length; i++) {
      points[dayIdx[moment(familyMember.history[i].date).format(dateFormat)]]+=familyMember.history[i].points;
    }

    //interpolation
    for (var i = 0; i < numDays; i++) {

      if(points[i] === 0){
        //interpolate
        if(lastPoints > 1){
          points[i] = lastPoints - 1
        }else{
          points[i]=0
        }
      }else{
        //add points to earned value
        points[i] += lastPoints;
      }

      //update the previous point value
      lastPoints = points[i];
    }

    return _.flatten([familyMember.firstName + ' ' + familyMember.lastName,points]);
  }


  factory.calculatePoints = function(family){
    var minDate = family[0].history[0].date;
    var day = moment(minDate);
    var now = moment();
    var output;

    var days = [];
    var dayIdx = {};

    var dateFormat = "MMM D, YY";
    var i = 0;
    while(day < now){

      days.push(day.format(dateFormat));
      dayIdx[day.format(dateFormat)] = i;
      day.add(1,'days');
      i++;
    }

    var points = []

    for (var i = 0; i < family.length; i++) {
      points.push(makeSeriesForOneFamilyMember(family[i],dayIdx,dateFormat));
    };

    //return data in special format for c3
    points.unshift(_.flatten(['x',days]));
    
    return points;
  };

  return factory;

}])