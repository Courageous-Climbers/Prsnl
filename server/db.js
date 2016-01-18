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
  var Family = mongoose.model('Family',FamilySchema);

//insert data for testing purposes
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

  exports.getAllFamily = function  (userId) {
    return User.findOne({_id:userId},'family',function(err,user){
      if(err){
        console.log(err);
      }else{
        console.log(user.family);
      }
    });
  };

  exports.addFamilyMember = function(userId,familyObj){
    return User.findOne({_id:userId},function(err,user){
      if(err){
        console.log(err);
      }else{
        console.log('here is the data:', userId, user, familyObj);
        user.family.push(familyObj);
        user.save(function(err){
          if(err){
            console.log(err);
            return err;
          }else{
            console.log('saved?');
            return "saved?";
          }  
        });
      }
    });
  }

  exports.addHistory = function(userId,familyId,histObj){
    return User.findOne({_id:userId},function(err,user){
      if(err){
        console.log(err);
      }else{
        console.log('here is the data:', histObj);
        var familyMember = _.find(user.family,function(family){
          console.log(family._id.toString(),familyId);
          return family._id.toString() === familyId;
        })
        console.log('found this family member',familyMember);

        familyMember.history.push(histObj);

        user.save(function(err){
          if(err){
            console.log(err);
            return err;
          }else{
            console.log('saved?');
            return "saved?";
          }  
        });
      }
    });
  }
  exports.verifyUser = function (userObj) {
    console.log('verifying user in the db',userObj);
    return User.find(userObj, '_id').exec();
  };

  exports.saveUser = function (userObj) {
    var user = new User(userObj); 
    console.log(userObj)

    return user.save(function (err, user){
      if (err){
        return console.error(err);
      } else {
        return user;
      }
    });
  };

});  // end of db.once
