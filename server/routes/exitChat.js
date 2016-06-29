

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var roomModel = require('../models/chatrooms') // import roomModel

var room = roomModel.chatRoom;

router.post('/exitChat',function(req,res){
  roomName=req.session.roomName;
  username=req.session.username;
  usertype=req.session.usertype;
  current_members=[];
  room.findOne({'roomName':roomName},function(err,data){
    current_members=data.roomMembers;
    index=current_members.indexOf(username);
    if(index>-1){
      current_members.splice(index,1);
    }
    room.update({'roomName':roomName},{'roomMembers':current_members},function(err,data){
      room_clients=clients[roomName];
      delete clients[roomName][username];
      Object.keys(room_clients).forEach(function(key,index){
        room_clients[key].send(JSON.stringify({'message_type':'user exit','username':username}));
      });
      req.session.username=undefined;
      req.session.roomName=undefined;
      req.session.usertype=undefined;
      endResponse();
    });
  });
  function endResponse() {
    res.end('request ended');
  }
});

module.exports=router;
