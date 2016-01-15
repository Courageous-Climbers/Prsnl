var express = require('express');
var db = require('./db.js');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8000;

var app = express();
app.use(morgan('combined'))


app.use(express.static(__dirname + '/../client'));  //serve files in client

app.use(bodyParser.json())  // parse application/json


console.log("this is db: ", db);
db.saveTask({
  userName: 'Hotline Karun', 
  familyMember:'Coldline Blaine', 
  type: 'call'  
});

db.getTasksFor('Hotline Karun').then(function(data){
  console.log(data);
})

app.listen(port);
