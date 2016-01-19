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

  db.verifyUser(req.params,function(err,data){
    if(err){
      res.status(404).send(err);
    }else{
      res.status(201).send(data);
    }
  });
})

// Save a user to DB 
app.post('/api/user', function (req, res, next){

  db.addUser(req.body,function (err,data){
    if(err){
      res.status(404).send(err);
    }else{
      res.status(201).send(data);
    }
  });
})

//add new family member to user
app.post('/api/family/:userId',function (req,res,next){
  db.addFamilyMember(req.params.userId,req.body, function(err,data){
    if(err){
      res.status(404).send(err);
    }else{
      res.status(201).send(data);
    }
  });
})

//add new history to user's family member
app.post('/api/history/:userId/:familyId',function(req,res,next){
  db.addHistory(req.params.userId, req.params.familyId, req.body, function(err,data){
    if(err){
      res.status(404).send(err);
    }else{
      res.status(201).send(data);
    }
  });
})

//get all family info for a user
app.get('/api/family/:userId',function(req,res,next){
  db.getAllFamily(req.params.userId, function(err,data){
    if(err){
      res.status(404).send(err);
    }else{
      res.status(200).send(data);
    }
  });
});

app.listen(port);
