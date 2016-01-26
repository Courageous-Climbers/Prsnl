# GaussHyrax
Manage the people in your life

### Family View ###

### Action View ###

### Notes View ###

### Summary View ###


Add a family member

USERS 
inserting a new user
'/api/user'
curl -d '{"userName":"test","password":"1234"}' -H "Content-Type: application/json" http://localhost:3000/api/user

verifying a user
'/api/user/:userName/:password'
curl -i http://localhost:3000/api/user/test/123
where test is the username and 123 is the password

GET
get all family
'/api/family/:userId'
curl -i http://localhost:3000/api/family/569d49d66d5c5ab72d1be6fc

ADD
add family member to user
curl -d '{"firstName":"test2"}' -H "Content-Type: application/json" http://localhost:3000/api/family/569d49d66d5c5ab72d1be6fb

add history to a user's family member
'/api/history/:userId/:familyId'
curl -d '{"action":"test2"}' -H "Content-Type: application/json" http://localhost:3000/api/history/569d49d66d5c5ab72d1be6fb/569d49e46d5c5ab72d1be6fc




BACKEND NOTES

app.get('/api/user/:userName/:password', function(req,res,next){
  //how to access userName and pasword values
  req.params.userName
  req.params.password
});

