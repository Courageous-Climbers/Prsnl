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

app.post('/api/task',function(req,res,next){
  db.saveTask({
    userName: 'Hotline Karun', 
    familyMember:'Coldline Blaine', 
    type: 'call'  
  }).then(function(){
    res.status(200);
  });
});

app.get('/api/task',function(req,res,next){
  db.getTasksFor('Hotline Karun').then(function(data){
    res.status(200).send(data);
  })
});

// Find a user

app.get('/api/user', function (req, res, next){
  console.log("get request", req.body, req.param('userName'),req.param('password'));
  db.verifyUser({
    userName: req.param('userName'),  //GET request has parameters from userObj in login.js
    password: req.param('password')
  }).then(function (data,err){
    console.log("varify", data)
    console.log('>>>>>>>>',data);
    
    res.status(200).send(data);
    

  })
})

// Save a user to DB 

app.post('/api/user', function (req, res, next){
  db.saveUser({
    userName: req.body.userName,  //POST request has a body
    password: req.body.password
  }).then(function (){
    res.status(200).send("saved");
  })
})



app.listen(port);
