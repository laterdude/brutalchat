
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var roomModel = require('../models/chatrooms') // import roomModel

var room = roomModel.chatRoom;

router.post('/createRoom',function(req,res){
  username=req.body.username;
  roomName=req.body.roomName;
  roomPassword=req.body.roomPassword;
  adminPassword=req.body.adminPassword;
  roomCreationDate=new Date();
  messages=[];
  roomMembers=[username];
  if(username.length==0||username=="") {
    res.end(parseError[1]);
  }
  else
  if(roomName.length==0||roomName=="") {
    res.end(parseError[2]);
  }
  else
  if(roomPassword.length==0||roomPassword=="") {
    res.end(parseError[3]);
  }
  else
  if(adminPassword.length==0||adminPassword=="") {
    console.log('here');
    res.end(parseError[7]);
  }
  else {
    room.find({'roomName':roomName},function(err,data){
      if(data.length==0) {
        createNew();
      }
      else {
        res.end(parseError[0]);
      }
    })
    function createNew() {
          var createdRoom = new room({roomName:roomName,roomPassword:roomPassword,roomCreationDate:roomCreationDate,messages:messages,roomAdmin:username,roomAdminPassword:adminPassword,roomMembers:roomMembers});
          createdRoom.save();
          req.session.username=username;
          req.session.roomName=roomName;
          req.session.usertype='admin';
          res.end('');
      }
    }
});

module.exports=router;
