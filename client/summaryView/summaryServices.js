angular.module('SummaryServicesModule',[])

.factory('SummaryFactory',['$http','$window',function($http,$window){

  var dateFormat = "MMM D, YY";

  var factory = {};
  factory.currentPointValue = {};
  factory.pointGraph = {};
  factory.xLabels = [];

  //helper function
  var makeSeriesForOneFamilyMember = function(familyMember,dayIdx){
    var points=[];
    var lastPoints = 0;
    var numDays = Object.keys(dayIdx).length;

    //initialize points array to be 0
    for (var i = 0; i < numDays; i++) {
      points[i] = 0;
    }

    //add points that are earned
    for (var i = 0; i < familyMember.history.length; i++) {
      points[dayIdx[moment(familyMember.history[i].date).format(dateFormat)]]+=familyMember.history[i].points;
    }

    //interpolate
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


  factory.calculateGraphForSetOfFamilyMembers = function(family){
    //min date will be the first history item of the first person added
    var minDate = family[0].history[0].date;
    var day = moment(minDate);
    var now = moment();
    var series;

    var days = [];
    var dayIdx = {};

    
    //determine x values
    var i = 0;
    while(day < now){

      days.push(day.format(dateFormat));
      dayIdx[day.format(dateFormat)] = i;
      day.add(1,'days');
      i++;
    }
    //store this so it can be used later
    this.xLabels = _.flatten(['x',days]);

    //calculate series for each family member
    var points = [];
    for (var i = 0; i < family.length; i++) {
      series  = makeSeriesForOneFamilyMember(family[i],dayIdx,dateFormat)
      points.push(series.slice());
      
      //store this data so it can be retrieved/updated later
      this.pointGraph[family[i]['_id']] = series.slice();
      this.currentPointValue[family[i]['_id']] = series[series.length-1];

    };

    //return data in special format for c3
    points.unshift(factory.xLabels);
    
    return points;
  };

  factory.calculateGraphForOneFamilyMember = function(familyMemberId){
    var output = [this.pointGraph[familyMemberId].slice()];
    output.unshift(this.xLabels);
    return output;
  };

  factory.makeChart = function(data){
    var xAxis;
    var rendered;

    var chart = c3.generate({
      
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
  return factory;

}])