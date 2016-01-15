var express = require('express');
var db = require('./db.js');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

var app = express();

app.use(morgan('combined'))
app.use(express.static(__dirname + '/../client'));  //serve files in client
app.use(bodyParser.json())  // parse application/json

//console.log("this is db: ", db);

app.post('/data',function(req,res,next){
  db.saveTask({
    userName: 'Hotline Karun', 
    familyMember:'Coldline Blaine', 
    type: 'call'  
  }).then(function(){
    res.send(200);
  });
});

app.get('/data',function(req,res,next){
  db.getTasksFor('Hotline Karun').then(function(data){
    res.send(200,data);
  })
});

app.listen(port);
