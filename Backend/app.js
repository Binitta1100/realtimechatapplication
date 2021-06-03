const express = require('express');
const UserData = require('./src/model/Userdata');
const cors = require('cors');
const jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
var app = new express();
app.use(cors());
app.use(express.json());

function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request');
      }
      let token = req.headers.authorization.split(' ')[1]
      if(token == 'null'){
        return res.status(401).send('Unauthorized request');
      }
      let payload = jwt.verify(token, 'secretKey')
      if(!payload){
        return res.status(401).send('Unauthorized request');
      }
      req.userId = payload.subject;
      next();
}

app.post('/newuser', function(req,res){
    console.log(req.body);
    var user = {
        username : req.body.user.username,
        email : req.body.user.email,
        pwd : req.body.user.pwd
    }
    var user = new UserData(user);
    user.save();
});

app.post('/login',function(req,res){
    let userData = req.body;
    UserData.findOne({username: userData.username})
    .then(function(user){
        if(user.pwd == userData.pwd){
            let payload = {subject:username+pwd};
            let token = jwt.sign(payload,'secretKey');
            res.status(200).send({token});
        }
        else{
            res.status(401).send('Invalid Password');
        }
    })
    .catch(function(){
        res.status(401).send('Invalid Username');
    }) 
});

app.listen(3000, function(){
    console.log('Listening to port 3000');
});