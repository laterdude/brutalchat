
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var roomModel = require('../models/chatrooms') // import roomModel

var room = roomModel.chatRoom;

router.post('/joinRoom',function(req,res){
  username=req.body.username;
  roomName=req.body.roomName;
  roomPassword=req.body.roomPassword;
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
  else {
    room.findOne({'roomName':roomName},function(err,data){
      if(data==undefined||data.length==0) {
        res.end(parseError[4]);
      }
      else {
        authenticateCombination(roomName,data.roomPassword,data.roomMembers,data.roomAdmin,data.roomAdminPassword);
      }
    })
    function authenticateCombination(roomName,password,members,admin,adminPass) {
          if(username==admin&&roomPassword!=adminPass) {
            res.end(parseError[8]);
          }
          else
          if(username==admin&&roomPassword==adminPass){
            if(members.indexOf(admin)<0){
              existingMembers=members;
              existingMembers.push(admin);
              req.session.username=admin;
              req.session.roomName=roomName;
              req.session.usertype='admin';
              room.update({'roomName':roomName},{'roomMembers':members}).then(res.end(''));
            }
            else {
              res.end(parseError[6]);
            }
          }
          else
          if(roomPassword==password)
          {
            if(members.indexOf(username)<0) {
              existingMembers=members;
              existingMembers.push(username);
              req.session.username=username;
              req.session.roomName=roomName;
              req.session.usertype='non-admin';
              room.update({'roomName':roomName},{'roomMembers':members}).then(res.end(''));
            }
            else {
              res.end(parseError[6]);
            }
          }
          else {
            res.end(parseError[5]);
          }
      }
    }
});

module.exports=router;
