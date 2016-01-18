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

// Find a user
app.get('/api/user/:userName/:password', function (req, res, next){
  //console.log("deprecated get request", req.body, req.param('userName'),req.param('password'));
  console.log("new get request", req.body, req.params.userName,req.params.password);
  
  db.verifyUser({
    userName: req.params.userName,  //GET request has parameters from userObj in login.js
    password: req.params.password
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

//add new family member to user
app.post('/api/family/:userId',function(req,res,next){
  db.addFamilyMember(req.params.userd,req.body).then(function(){
    res.sendStatus(201);
  });
})

//add new history to user's family member
app.post('/api/history/:userId/:familyId',function(req,res,next){
  db.addHistory(req.params.userId,req.params.familyId,req.body).then(function(){
    res.sendStatus(201);
  });
})

//get all family info for a user
app.get('/api/family/:userId',function(req,res,next){
  db.getAllFamily(req.params.userId).then(function(data){
    res.status(200).send(data);
  })
});

app.listen(port);
