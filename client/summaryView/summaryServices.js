angular.module('SummaryServicesModule',[])

.filter('niceDate', function() {
  return function(input) {
    return moment(input).format("MMM D, YYYY");
  };
})

.factory('SummaryFactory',['$http','$window', '$timeout', function($http,$window,$timeout){

  var dateFormat = "MMM D, YYYY";
  var chart;
  var donut;

  var xIdx = {};
  var familyLookUp = {};
  var historyLookUp = {};
  var factory = {};
  var xLines = [];

  factory.currentPointValue = {};
  factory.pointGraph = {};
  factory.actionsDonut = {};
  factory.xLabels = [];

  //helper function
  var calculatePointsGraphFromHistory = function(history){
    var points=[];
    var lastPoints = 0;
    var numDays = Object.keys(xIdx).length;
    //initialize points array to be 0
    for (var i = 0; i < numDays; i++) {
      points[i] = 0;
    }

    //add points that are earned
    for (var i = 0; i < history.length; i++) {
      points[xIdx[moment(history[i].date).format(dateFormat)]]+=history[i].points;
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
    return points;
  }

  var makeSeriesForOneFamilyMember = function(familyMember,dayIdx){

    var actionCount = {};
    var actionArray = [];
    var action;

    var points = calculatePointsGraphFromHistory(familyMember.history);

    for (var i = 0; i < familyMember.history.length; i++) {
      action = familyMember.history[i].action.toLowerCase();
      if(!actionCount[action]){
        actionCount[action] = 0
      }
      actionCount[action]++;
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
    if(!family || !family[0]){
      //return empty data to plot
      return {
        linePlot: [],
        donutPlot: []
      }
    }

    var now = moment();
    var minDate = moment().subtract(3,'months');
    var day = minDate;

    var series;
    var actions = {};
    var actionArray = [];
    var days = [];
    var dayIdx = {};

    
    //determine x values
    var i = 0;
    while(day <= now){
      days.push(day.format(dateFormat));
      dayIdx[day.format(dateFormat)] = i;
      if(day.date() === 1){
        xLines.push({value: day.format(dateFormat), text: day.format("MMM")})
      }
      day.add(1,'days');
      i++;
    }

    //store this so it can be used later
    this.xLabels = _.flatten(['x',days]);
    xIdx = dayIdx;

    //calculate series for each family member
    var points = [];
    var action;
    for (var i = 0; i < family.length; i++) {
      series  = makeSeriesForOneFamilyMember(family[i],dayIdx,dateFormat)
      points.push(series.linePlot.slice());
      
      //aggregate actions
      for(var j=0; j<series.donutPlot.length; j++){
        action = series.donutPlot[j][0];
        if(!actions[action]){
          actions[action] = 0;
        }
        actions[action]+= series.donutPlot[j][1];
      }

      //store this data so it can be retrieved/updated later
      this.pointGraph[family[i]['_id']] = series.linePlot.slice();
      this.currentPointValue[family[i]['_id']] = series.linePlot[series.linePlot.length-1];
      this.actionsDonut[family[i]['_id']] = series.donutPlot.slice();
      familyLookUp[family[i]['_id']] = family[i];

      //create a history lookup so that information can be shown on the tooltip
      historyLookUp[family[i]['_id']] = {};
      for (var j = 0; j < family[i].history.length; j++) {
        if(!historyLookUp[family[i]['_id']][moment(family[i].history[j].date).format(dateFormat)]){
          historyLookUp[family[i]['_id']][moment(family[i].history[j].date).format(dateFormat)]  = []
        }
        historyLookUp[family[i]['_id']][moment(family[i].history[j].date).format(dateFormat)].push(_.extend(family[i].history[j],{name:family[i].firstName + ' ' + family[i].lastName}));
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

  factory.addSingleEvent = function(id,historyEvent){
    var prettyDate = moment(historyEvent.date).format(dateFormat);

    //add event to history lookup so it shows up on tooltip
    if(!historyLookUp[id][prettyDate]){
      historyLookUp[id][prettyDate] = [];
    }
    historyLookUp[id][prettyDate].push(_.extend(historyEvent,{name:familyLookUp[id].firstName + ' ' + familyLookUp[id].lastName}));

    //modify graph
    //var chartValues = chart.data.values(id);
    if(xIdx[prettyDate]){
      var chartValues = calculatePointsGraphFromHistory(familyLookUp[id].history);
      chartValues.unshift(id)
      chart.load({
        columns:[chartValues],
        unload:[id]
      })

      //update pointGraph so if it is loaded again, we have the new info
      this.pointGraph[id] = chartValues;

      //update the current point value
      factory.currentPointValue[id] = chartValues[chartValues.length-1];
    }

    //modify donut
    var action = historyEvent.action.toLowerCase();
    var donutValue = donut.data.values(action) || 0;
    donut.load({
      columns:[[action, parseInt(donutValue)+1]],
      unload:[action]
    });

    //save the donut info so it can be loaded later
    var found = false;

    for (var i = 0; i < this.actionsDonut[id].length; i++) {
      if(this.actionsDonut[id][i][0] === historyEvent.action){
        this.actionsDonut[id][i][1] = parseInt(donutValue)+1;
        found= true;
        break;
      }
    }

    if(!found){
      this.actionsDonut[id].push([historyEvent.action, 1])
    }

  };

  factory.makeChart = function(data,refresh){
    var xAxis;
    var rendered;

    if(chart && !refresh){
      chart.load({
        columns:data.linePlot,
        unload:true
      });
    }else{
      chart = c3.generate({
        
        bindto: '#chart',
        size: {
          height: 240
          // /width: 480
        },
        data:{
          x:'x',
          columns: data.linePlot,
          type: 'area'
          //groups: data.x,
        },
        axis: {
          x: {
              type: 'category', // this needed to load string x value
              label: {
                text: 'time',
                position: 'outer-center'
              }
          },
          y: {
            label: {
                text: 'points',
                position: 'outer-middle'
              }
          }
        },
        grid: {
          x: {
            lines: xLines
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
        transition: {
          duration: 1000
        },
        tooltip: {
          format:{
            name: function (name, ratio, id, index) {
              var tasks = historyLookUp[id][factory.xLabels[index+1]];
              var displayStr = "";
              if(!tasks){
                return familyLookUp[id].firstName + ' ' + familyLookUp[id].lastName ;
              }
              displayStr += tasks[0].name + '<br>';
              for (var i = 0; i < tasks.length; i++) {
                  displayStr += '<b>' + tasks[i].action + 
                  ' (+' + tasks[i].points + ' pts)' + '</b><br>"' + 
                  tasks[i].notes + '"<br>' ;
              }
              return displayStr;
             }
          },
           grouped: false // Default true
         }
      });

      //zoom to the last 4 weeks
      $timeout(function(){
        if(data.linePlot[0]){
          chart.zoom([data.linePlot[0].length-28, data.linePlot[0].length-1])
        }
      },1000);
    }


    if(donut && !refresh){
      donut.load({
        columns:data.donutPlot,
        unload:true
      });
    }else{
      donut = c3.generate({
        bindto: '#donut',
        size: {
          height:240,
          width: 240
        },
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
          position:'bottom'
        },
         transition: {
          duration: 1500
        }
      });
    }
  };
  return factory;

}])