angular.module('SummaryServicesModule',[])

.factory('SummaryFactory',['$http','$window',function($http,$window){

  var dateFormat = "MMM D, YYYY";

  var factory = {};
  factory.currentPointValue = {};
  factory.pointGraph = {};
  factory.actionsDonut = {};
  factory.xLabels = [];
  factory.historyLookUp = {};

  //helper function
  var makeSeriesForOneFamilyMember = function(familyMember,dayIdx){
    var points=[];
    var actionCount = {};
    var actionArray = [];

    var lastPoints = 0;
    var numDays = Object.keys(dayIdx).length;

    //initialize points array to be 0
    for (var i = 0; i < numDays; i++) {
      points[i] = 0;
    }

    //add points that are earned
    for (var i = 0; i < familyMember.history.length; i++) {
      points[dayIdx[moment(familyMember.history[i].date).format(dateFormat)]]+=familyMember.history[i].points;
      
      if(!actionCount[familyMember.history[i].action]){
        actionCount[familyMember.history[i].action] = 0
      }

      actionCount[familyMember.history[i].action]++;
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

    //turn actionCount object into an array
    var actionArray = _.map(actionCount, function(value, index) {
      return [index,value];
    });

    return {
      linePlot: _.flatten([familyMember['_id'],points]),
      donutPlot: actionArray
    }
  }


  factory.calculateGraphForSetOfFamilyMembers = function(family){

    //check if there is anything to plot
    if(!family || !family[0] || !family[0].history[0]){
      //return empty data to plot
      return {
        linePlot: [],
        donutPlot: []
      }
    }

    console.log('calculating graph for family',family);
    
    //min date will be the first history item of the first person added
    var minDate = family[0].history[0].date;
    var day = moment(minDate);
    var now = moment();
    var series;
    var actions = {};
    var actionArray = [];
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
      points.push(series.linePlot.slice());
      
      //aggregate actions
      for(var j=0; j<series.donutPlot.length; j++){

        if(!actions[series.donutPlot[j][0]]){
          actions[series.donutPlot[j][0]] = 0;
        }
        actions[series.donutPlot[j][0]]+= series.donutPlot[j][1];
      }

      //store this data so it can be retrieved/updated later
      this.pointGraph[family[i]['_id']] = series.linePlot.slice();
      this.currentPointValue[family[i]['_id']] = series.linePlot[series.linePlot.length-1];
      this.actionsDonut[family[i]['_id']] = series.donutPlot.slice();

      //create a history lookup so that information can be shown on the tooltip
      factory.historyLookUp[family[i]['_id']] = {};
      for (var j = 0; j < family[i].history.length; j++) {
        factory.historyLookUp[family[i]['_id']][moment(family[i].history[j].date).format(dateFormat)] = _.extend(family[i].history[j],{name:family[i].firstName + ' ' + family[i].lastName});
      }

    };

    //return data in special format for c3
    points.unshift(factory.xLabels);
    
    //turn types into an array
    var actionArray = _.map(actions, function(value, index) {
      return [index,value];
    });

    return {
      linePlot: points,
      donutPlot: actionArray
    }

  };

  factory.calculateGraphForOneFamilyMember = function(familyMemberId){
    //check if there is anything to plot
    if(!this.pointGraph[familyMemberId]){
      return {
        linePlot:[],
        donutPlot: []
      }
    }

    var output = [this.pointGraph[familyMemberId].slice()];
    output.unshift(this.xLabels);
    return {
      linePlot:output,
      donutPlot: this.actionsDonut[familyMemberId]
    }
  };

  factory.makeChart = function(data){
    var xAxis;
    var rendered;

    var chart = c3.generate({
      
      bindto: '#chart',
      size: {
        height: 240,
        width: 480
      },
      data:{
        x:'x',
        columns: data.linePlot,
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
      },
      tooltip: {
         format:{
           name: function (name, ratio, id, index) {
            if(factory.historyLookUp[id][factory.xLabels[index+1]]){
               return factory.historyLookUp[id][factory.xLabels[index+1]].name + '<br><b>' + 
                        factory.historyLookUp[id][factory.xLabels[index+1]].action + 
                        ' (' + factory.historyLookUp[id][factory.xLabels[index+1]].points + ' pts)' + '</b><br>"' + 
                          factory.historyLookUp[id][factory.xLabels[index+1]].notes + '"' ;
            }else{
              return "";
            }
           }
        },
         grouped: false // Default true
       }
    });
 
    var donut = c3.generate({
      bindto: '#donut',
      data:{
        columns: data.donutPlot,
        type: 'donut'
      },
      donut:{
        label:{
          format: function(value, ratio){
            return  value;
          }
        }
      },
      legend:{
        position:'right'
      }
    });
  };
  return factory;

}])