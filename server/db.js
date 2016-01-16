var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hyrax');

var db = mongoose.connection;

var exports = module.exports;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("db open");

  // schemas needed: family, user, task
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
    userName: String

  });

  var UserSchema = mongoose.Schema({
    userName: {type:String,index:{unique:true}},
    password: String
  });

  var TaskSchema = mongoose.Schema({
    date: Date,
    userName: String,
    familyMember: String,
    points: Number,
    notes: String,
    type: String
  });

// instantiate the models

  var User = mongoose.model('User',UserSchema);
  var Task = mongoose.model('Task',TaskSchema);
  var Family = mongoose.model('Family',FamilySchema);

  exports.getTasksFor = function  (userName) {
    return Task.find({userName:userName},function(err,data){
      if(err){
        console.log(err);
      }else{
        return data;
      }
    });
  };

  exports.getFamily = function  (userName) {
    return Family.find({userName:userName},function(err,data){
      if(err){
        console.log(err);
      }else{
        return data;
      }
    });
  };

  exports.saveTask = function  (taskObj) {

    var task = new Task(taskObj);

    return task.save(function(err,task){
      if (err) return console.error(err);
      // console.log('promised save', user);
      return task;
    });
  };

  exports.verifyUser = function (userObj) {
    console.log('verifying user in the db',userObj);
    return User.find(userObj).exec();
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
