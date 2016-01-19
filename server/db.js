var mongoose = require('mongoose');
var _ = require('underscore');

mongoose.connect('mongodb://localhost/hyrax');

var db = mongoose.connection;

var exports = module.exports;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("db open");

  // information about a family member
  // each family member has a contact frequency (user specified)
  // next contact date will be determined by last contact date and contact freq

  //stores a history off all interactions
  var RelationshipHistorySchema = mongoose.Schema({
    date: Date,
    action: String,  //what was the task
    points: Number,
    notes: String
  });

  var FamilySchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    streetAddress: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
    nextContactDate: Date,      //determines order in the list
    contactFrequency: Number,   //number of days till next task
    history:[RelationshipHistorySchema]
  });

  var UserSchema = mongoose.Schema({
    userName: {type:String,index:{unique:true}},
    password: String,
    family:[FamilySchema]
  });

  //store the possible actions 
  //will be its own independent doc/collection
  var TaskSchema = mongoose.Schema({
    // _id will be task_id
    points: Number,
    action: String
  });

// instantiate the models

  var User = mongoose.model('User',UserSchema);
  var Task = mongoose.model('Task',TaskSchema);

  //task table
  db.collections['tasks'].remove();
  var tasks = [
    {
      action:"make call",
      points:8
    },{
      action:"send text",
      points:3
    },{
      action:"send letter",
      points:6
    },{
      action:"send email",
      points:4
    },{
      action:"have coffee",
      points:10
    },{
      action:"have dinner",
      points:10
    },{
      action:"have lunch",
      points:10
    },{
      action:"have drinks",
      points:10
    }
  ]
  Task.create(tasks);

  //insert default data for testing purposes
  // 2 users
  // each have 5 family
  // each family has 1 - 10 tasks
  db.collections['users'].remove();
  var user1 = {
    userName: 'Gandalf',
    password: 'DeezNuts',
    family:[{
      firstName:"frodo",
      lastName:"baggins",
      nextContactDate: new Date(),
      contactFrequency: 14,
      history:[
        {
          action:"call",
          notes:"this guy is a nn",
          points:10,
          date: new Date()
        },
        {
          action:"email",
          notes:"no, wait, I am a nn",
          points:5,
          date: new Date()
        },
        {
          action:"email",
          notes:"love emailing this guy",
          points:5,
          date: new Date()
        }
      ]

    },{
      firstName:"bilbo",
      lastName:"baggins",
      nextContactDate: new Date(),
      contactFrequency: 7,
      history:[
        {
          action:"text",
          notes:"I love ice cream",
          points:2,
          date: new Date()
        },
        {
          action:"call",
          notes:"he does a great impression of Pee Wee Herman",
          points:5,
          date: new Date()
        }
      ]
    }
    ]
  };
  // See http://mongoosejs.com/docs/models.html for details on the `create` method
  User.create([user1]);

  exports.getAllFamily = function  (userId,callback) {
    return User.findOne({_id:userId},'family',function(err,user){
      if(!user){
        return callback('user _id ' + userId + ' not found',null);
      }else{
        return callback(err,user.family);
      }
    });
  };

  exports.addFamilyMember = function(userId,familyObj,callback){
    return User.findOne({_id:userId},function(err,user){
      if(err){
        return callback(err,null);
      }else if(!user){
        return callback('user _id ' + userId + ' not found',null);
      }

      //if we get here, we found the user without error.  So update the family
      user.family.push(familyObj);

      user.save(function(err,user){
        return callback(err,user.family[user.family.length-1]); 
      });
    
    });
  }

  exports.addHistory = function(userId, familyId, histObj, callback){
    return User.findOne({_id:userId},function(err,user){
      
      if(err){
        return callback(err,null);
      }else if(!user){
        return callback('user _id ' + userId + ' not found',null);
      }

      //we found a user without error, now we need to find the family member
      var familyMember = _.find(user.family,function(family){
        return family._id.toString() === familyId;
      })
      
      if(!familyMember){
        return callback('family member _id ' + familyId + ' not found',null);
      }

      //we found a user, and a family member, now need to update
      familyMember.history.push(histObj);

      user.save(function(err){
        return callback(err, familyMember.history[familyMember.history.length-1]); 
      });
    
    });
  }
  exports.verifyUser = function (userObj,callback) {

    User.findOne(userObj, '_id',function(err,user){
      if(!user){
        return callback('user not found', null);
      }else{
        return callback(err,user['_id']);
      }
    });
  };

  exports.addUser = function (userObj,callback) {
    var user = new User(userObj); 

    //user validation
    if(!userObj.password){
      return callback('password field required',null);
    }else if(!userObj.userName){
      return callback('userName field required',null);
    }

    user.save(function (err, user){
      return callback(err,user);
    });
  };

});  // end of db.once
